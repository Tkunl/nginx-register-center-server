import { ArgumentsHost, ExceptionFilter, HttpException } from '@nestjs/common'
import { BizRequest } from '../type/biz-request.type'
import { Response } from 'express'
import { REQUEST_ID, RESPONSE_TIMESTAMP } from '../constant'
import { R } from '../po/r.po'
import { SysCodeEnum } from '../enum/sys-code.enum'

export class GlobalExceptionFilter implements ExceptionFilter {
  catch(exception: Error, host: ArgumentsHost) {
    const ctx = host.switchToHttp()
    const req = ctx.getRequest<BizRequest>()
    const res = ctx.getResponse<Response>()
    res.header(REQUEST_ID, req.requestId)
    res.header(RESPONSE_TIMESTAMP, req.requestTimestamp + '')

    const statusCode = exception instanceof HttpException ? exception.getStatus() : 500
    res.status(statusCode).json(R.error(SysCodeEnum.ERROR, exception.message))
  }
}
