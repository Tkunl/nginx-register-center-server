import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from '@nestjs/common'
import { Observable, tap } from 'rxjs'
import { Response } from 'express'
import { InvokeRecord, InvokeRecordName } from '../schema/invoke-record.schema'
import { Model } from 'mongoose'
import { InjectModel } from '@nestjs/mongoose'
import { BizRequest } from '../types/biz-request'
import { ErrorRecord, ErrorRecordName } from '../schema/error-record.schema'
import { loggerConfig } from '../config/logger.config'
import { isNotNil } from 'es-toolkit'
import { isValidationException } from '../utils/is'

@Injectable()
export class InvokeRecordInterceptor implements NestInterceptor {
  @InjectModel(InvokeRecordName)
  private invokeRecordModel: Model<InvokeRecord>

  @InjectModel(ErrorRecordName)
  private errorRecordModel: Model<ErrorRecord>

  stringifyAndSubstring<T>(data: T): T extends object ? string : T
  stringifyAndSubstring<T>(data: T): string | T {
    if (isNotNil(data) && typeof data === 'object') {
      let dataStr = JSON.stringify(data)
      if (dataStr.length > 1000) {
        dataStr = dataStr.substring(0, 1000) + '... [TRUNCATED]'
      }
      return dataStr
    }
    return data
  }

  intercept(
    context: ExecutionContext,
    next: CallHandler<any>,
  ): Observable<any> | Promise<Observable<any>> {
    const _req = context.switchToHttp().getRequest<BizRequest>()
    const _res = context.switchToHttp().getResponse<Response>()

    const { ip, method, path, query, params, body, requestId, headers } = _req

    const record = new InvokeRecord()
    record.requestId = requestId
    // request method, such as GET, POST ...
    record.method = method
    // request url path
    record.path = path
    // query parameters, 直接结构化存储
    record.query = query
    // path parameters, 直接结构化存储
    record.params = params
    // request headers, 直接结构化存储
    record.headers = headers
    // request body
    if (!loggerConfig.excludesRecordBodyList.some((url: string) => url === path)) {
      record.requestBody = this.stringifyAndSubstring(body)
    }
    record.ip = ip ?? ''
    // Controller class name
    record.invokeClass = context.getClass().name
    // Controller handler method name
    record.invokeMethod = context.getHandler().name

    const now = _req.requestTimestamp
    // Current timestamp
    record.requestTimestamp = now

    return next.handle().pipe(
      tap({
        next: (res: Response) => {
          const createRecord = new this.invokeRecordModel({
            ...record,
            elapsedTime: Date.now() - now,
            response: this.stringifyAndSubstring(res),
            httpCode: _res.statusCode,
          } satisfies InvokeRecord)
          createRecord.save()
        },
        error: (err: Error) => {
          if (!isValidationException(err)) {
            const createRecord = new this.errorRecordModel({
              ...record,
              errorName: err.name,
              stack: err.stack,
              errorMessage: err.message,
              elapsedTime: Date.now() - now,
            } satisfies ErrorRecord)
            createRecord.save()
          }
        },
      }),
    )
  }
}
