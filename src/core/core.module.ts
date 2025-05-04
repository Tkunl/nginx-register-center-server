import { Global, Module } from '@nestjs/common'
import { APP_INTERCEPTOR } from '@nestjs/core'
import { MongooseModule } from '@nestjs/mongoose'
import { TddController } from './controller/tdd.controller'
import { InvokeRecordInterceptor } from './interceptor/invoke-record.interceptor'
import { ErrorRecordName, ErrorRecordSchema } from './schema/error-record.schema'
import { InvokeRecordName, InvokeRecordSchema } from './schema/invoke-record.schema'

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
  ],
  exports: [],
})
export class CoreModule {}
