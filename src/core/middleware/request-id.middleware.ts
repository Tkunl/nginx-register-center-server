import { Injectable, NestMiddleware } from '@nestjs/common'
import { Request, Response, NextFunction } from 'express'
import { uuid } from 'src/common/utils/common-util'
import { REQUEST_ID } from '../constant'
import { BizRequest } from '../type/biz-request.type'

@Injectable()
export class RequestIdMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    const requestId = req.headers[REQUEST_ID]?.toString() ?? uuid()
    const bizReq = req as BizRequest
    bizReq.requestId = requestId
    next()
  }
}
