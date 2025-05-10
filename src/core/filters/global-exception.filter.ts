import { ArgumentsHost, ExceptionFilter } from '@nestjs/common'
import { Response } from 'express'
import { CommonCodeEnum } from '../../common/enum/sys-code.enum'
import { R } from '../../common/po/r.po'
import { REQUEST_ID, RESPONSE_TIMESTAMP } from '../constant'
import { BizRequest } from '../type/biz-request.type'
import { BizException } from 'src/biz/exception/biz.exception'

export class GlobalExceptionFilter implements ExceptionFilter {
  catch(exception: Error, host: ArgumentsHost) {
    const ctx = host.switchToHttp()
    const req = ctx.getRequest<BizRequest>()
    const res = ctx.getResponse<Response>()
    res.header(REQUEST_ID, req.requestId)
    res.header(RESPONSE_TIMESTAMP, req.requestTimestamp + '')

    if (exception instanceof BizException) {
      return res.status(200).json(R.error(exception.code, exception.message))
    }

    return res.status(500).json(R.error(CommonCodeEnum.ERROR, exception.message))
  }
}
