import { Global, MiddlewareConsumer, Module, NestModule } from '@nestjs/common'
import { APP_INTERCEPTOR } from '@nestjs/core'
import { MongooseModule } from '@nestjs/mongoose'
import { BaseTddController } from './controller/tdd.controller'
import { InvokeRecordInterceptor } from './interceptor/invoke-record.interceptor'
import { ErrorRecordName, ErrorRecordSchema } from './schema/error-record.schema'
import { InvokeRecordName, InvokeRecordSchema } from './schema/invoke-record.schema'
import { RequestIdMiddleware } from './middleware/request-id.middleware'
import { GlobalResponseInterceptor } from './interceptor/global-response.interceptor'

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
  controllers: [BaseTddController],
  providers: [
    {
      provide: APP_INTERCEPTOR,
      useClass: InvokeRecordInterceptor,
    },
    {
      provide: APP_INTERCEPTOR,
      useClass: GlobalResponseInterceptor,
    },
  ],
  exports: [],
})
export class CoreModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(RequestIdMiddleware).forRoutes('*')
  }
}
