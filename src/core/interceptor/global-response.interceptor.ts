import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from '@nestjs/common'
import { Observable, tap } from 'rxjs'
import { REQUEST_ID, RESPONSE_TIMESTAMP } from '../constant'
import { BizRequest } from '../type/biz-request.type'
import { Response } from 'express'

@Injectable()
export class GlobalResponseInterceptor implements NestInterceptor {
  intercept(
    context: ExecutionContext,
    next: CallHandler<any>,
  ): Observable<any> | Promise<Observable<any>> {
    const req = context.switchToHttp().getRequest<BizRequest>()
    const res = context.switchToHttp().getResponse<Response>()

    return next.handle().pipe(
      tap(() => {
        res.header(REQUEST_ID, req.requestId)
        res.header(RESPONSE_TIMESTAMP, req.requestTimestamp + '')
      }),
    )
  }
}
