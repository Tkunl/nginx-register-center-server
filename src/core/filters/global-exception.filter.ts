import { ArgumentsHost, ExceptionFilter } from '@nestjs/common'
import { Response } from 'express'
import { DefaultCode, SystemErrorCode } from '../../common/enum/sys-code.enum'
import { R } from '../../common/po/r.po'
import { REQUEST_ID, RESPONSE_TIMESTAMP } from '../constant'
import { BizRequest } from '../types/biz-request'
import { BizException } from 'src/common/exception/biz.exception'
import { isValidationException } from '../utils/is'

export class GlobalExceptionFilter implements ExceptionFilter {
  catch(exception: Error, host: ArgumentsHost) {
    const ctx = host.switchToHttp()
    const req = ctx.getRequest<BizRequest>()
    const res = ctx.getResponse<Response>()
    res.header(REQUEST_ID, req.requestId)
    res.header(RESPONSE_TIMESTAMP, req.requestTimestamp + '')

    // 业务异常
    if (exception instanceof BizException) {
      return res.status(200).json(R.error(exception.code, exception.message))
    }

    // 校验异常
    if (isValidationException(exception)) {
      return res
        .status(200)
        .json(
          R.error(
            SystemErrorCode.PARAM_VALIDATION_ERROR,
            exception.message,
            (exception.getResponse() as { message: unknown }).message,
          ),
        )
    }

    return res.status(500).json(R.error(DefaultCode.ERROR, exception.message))
  }
}
