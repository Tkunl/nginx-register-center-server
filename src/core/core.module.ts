import { Global, MiddlewareConsumer, Module, NestModule } from '@nestjs/common'
import { APP_INTERCEPTOR } from '@nestjs/core'
import { MongooseModule } from '@nestjs/mongoose'
import { TddController } from './controller/tdd.controller'
import { InvokeRecordInterceptor } from './interceptor/invoke-record.interceptor'
import { ErrorRecordName, ErrorRecordSchema } from './schema/error-record.schema'
import { InvokeRecordName, InvokeRecordSchema } from './schema/invoke-record.schema'
import { RequestIdMiddleware } from './middleware/request-id.middleware'
import { ResponseInterceptor } from './interceptor/response.interceptor'

@Global()
@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: InvokeRecordName,
        schema: InvokeRecordSchema,
      },
      {
        name: ErrorRecordName,
        schema: ErrorRecordSchema,
      },
    ]),
  ],
  controllers: [TddController],
  providers: [
    {
      provide: APP_INTERCEPTOR,
      useClass: InvokeRecordInterceptor,
    },
    {
      provide: APP_INTERCEPTOR,
      useClass: ResponseInterceptor,
    },
  ],
  exports: [],
})
export class CoreModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(RequestIdMiddleware).forRoutes('*')
  }
}
