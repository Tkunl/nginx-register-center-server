import { Prop } from '@nestjs/mongoose'

export class BaseRecord {
  @Prop()
  method: string
  @Prop()
  path: string
  @Prop()
  query: string
  @Prop()
  params: string
  @Prop()
  requestBody: string
  @Prop()
  ip: string
  @Prop()
  userAgent: string
  @Prop()
  invokeClass: string
  @Prop()
  invokeMethod: string
  @Prop()
  elapsedTime: string
  @Prop()
  calledByUserId: string
  @Prop()
  calledByUsername: string
  @Prop()
  calledDate: Date
  @Prop()
  res: string
  @Prop()
  httpCode: string
}
