import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'

@Schema({ _id: false })
class EnvTag {
  @Prop({ required: true })
  env: string

  @Prop({ type: [String], required: true })
  tags: string[]
}

@Schema({ collection: 'app-infos' })
export class AppInfo {
  @Prop({ index: true })
  appId: string

  @Prop({ index: true })
  appName: string

  @Prop({ type: [EnvTag], required: true })
  appConfig: EnvTag[]

  @Prop()
  createdAt: number

  @Prop()
  updateAt: number

  constructor() {}
}

export const AppInfoSchema = SchemaFactory.createForClass(AppInfo)

export const AppInfoName = 'AppInfoName'
