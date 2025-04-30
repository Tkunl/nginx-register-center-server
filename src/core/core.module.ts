import { Global, Module } from '@nestjs/common'
import { MongooseModule } from '@nestjs/mongoose'
import { InvokeRecordName, InvokeRecordSchema } from './schema/invoke-record.schema'
import { ErrorRecordName, ErrorRecordSchema } from './schema/error-record.schema'

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
  controllers: [],
  providers: [],
  exports: [],
})
export class CoreModule {}
