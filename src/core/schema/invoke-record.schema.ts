import { Schema, SchemaFactory } from '@nestjs/mongoose'
import { BaseRecord } from './base-record'

@Schema({ collection: 'invoke-records' })
export class InvokeRecord extends BaseRecord {
  constructor() {
    super()
  }
}

export const InvokeRecordSchema = SchemaFactory.createForClass(InvokeRecord)

export const InvokeRecordName = 'InvokeRecord'
