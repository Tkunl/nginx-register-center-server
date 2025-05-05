import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from '@nestjs/common'
import { Observable, tap } from 'rxjs'
import { Response } from 'express'
import { InvokeRecord, InvokeRecordName } from '../schema/invoke-record.schema'
import { Model } from 'mongoose'
import { InjectModel } from '@nestjs/mongoose'
import { BizRequest } from '../type/biz-request.type'
import { ErrorRecord, ErrorRecordName } from '../schema/error-record.schema'
import { loggerConfig } from '../config/logger.config'
import { isNotNil } from 'es-toolkit'

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
        dataStr = dataStr.substring(0, 100) + '... [TRUNCATED]'
      }
      return dataStr
    }
    return data
  }

  intercept(
    context: ExecutionContext,
    next: CallHandler<any>,
  ): Observable<any> | Promise<Observable<any>> {
    const request = context.switchToHttp().getRequest<BizRequest>()
    const response = context.switchToHttp().getResponse<Response>()

    const userAgent = request.headers['user-agent']

    const { ip, method, path, query, params, body } = request

    const record = new InvokeRecord()
    // request method, such as GET, POST ...
    record.method = method
    // request url path
    record.path = path
    // query parameters, 此处可以直接结构化存储
    record.query = query
    // path parameters, 此处可以直接结构化存储
    record.params = params
    // request body
    if (!loggerConfig.excludesRecordBodyList.some((url: string) => url === path)) {
      record.requestBody = this.stringifyAndSubstring(body)
    }
    record.ip = ip ?? ''
    record.userAgent = userAgent ?? ''
    // Controller class name
    record.invokeClass = context.getClass().name
    // Controller handler method name
    record.invokeMethod = context.getHandler().name

    const now = Date.now()
    // Current timestamp
    record.timestamp = now

    return next.handle().pipe(
      tap({
        next: async (res: Response) => {
          const createRecord = new this.invokeRecordModel({
            ...record,
            elapsedTime: Date.now() - now,
            response: this.stringifyAndSubstring(res),
            httpCode: response.statusCode,
          } satisfies InvokeRecord)
          await createRecord.save()
        },
        error: async (err: any) => {
          const createRecord = new this.errorRecordModel({
            ...record,
            errorName: err.name,
            stack: err.stack,
            errorMessage: err.message,
            options: JSON.stringify(err.options),
            elapsedTime: Date.now() - now,
          } satisfies ErrorRecord)
          await createRecord.save()
        },
      }),
    )
  }
}
