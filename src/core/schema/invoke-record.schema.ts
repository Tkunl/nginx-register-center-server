import { Schema, SchemaFactory } from '@nestjs/mongoose'
import { BaseRecord } from './base-record'

@Schema({ collection: 'invoke-records' })
export class InvokeRecord extends BaseRecord {
  constructor() {
    super()
  }
}

export const InvokeRecordSchema = SchemaFactory.createForClass(InvokeRecord).pre(
  'save',
  function (next) {
    if (this.requestBody?.length > 1000) {
      this.requestBody = this.requestBody.substring(0, 1000) + '... [TRUNCATED]'
    }
    if (this.response?.length > 1000) {
      this.response = this.response.substring(0, 1000) + '... [TRUNCATED]'
    }
    next()
  },
)

export const InvokeRecordName = 'InvokeRecord'
