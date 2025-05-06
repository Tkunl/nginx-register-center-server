import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { BaseRecord } from './base-record.schema'

@Schema({ collection: 'error-records' })
export class ErrorRecord extends BaseRecord {
  @Prop()
  errorName: string

  @Prop()
  stack: string

  @Prop()
  errorMessage: string

  @Prop()
  options: string

  constructor() {
    super()
  }
}

export const ErrorRecordSchema = SchemaFactory.createForClass(ErrorRecord)

export const ErrorRecordName = 'ErrorRecord'
