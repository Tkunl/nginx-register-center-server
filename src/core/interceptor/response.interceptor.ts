import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from '@nestjs/common'
import { Observable, tap } from 'rxjs'
import { REQUEST_ID } from '../constant'

@Injectable()
export class ResponseInterceptor implements NestInterceptor {
  intercept(
    context: ExecutionContext,
    next: CallHandler<any>,
  ): Observable<any> | Promise<Observable<any>> {
    const req = context.switchToHttp().getRequest()
    const requestId = req.headers[REQUEST_ID]
    const response = context.switchToHttp().getResponse()
    return next.handle().pipe(
      tap(() => {
        response.header(REQUEST_ID, requestId)
      }),
    )
  }
}
