import { Prop } from '@nestjs/mongoose'
import { Schema } from 'mongoose'

/**
 * BaseRecord 类用于记录API请求的基本信息
 * 它包含了请求的方法、路径、查询参数等信息
 * 以及关于请求和响应的一些元数据
 */
export class BaseRecord {
  /**
   * method 表示发起请求时使用的 HTTP 方法 (如 GET, POST 等）。
   */
  @Prop({ index: true })
  method: string

  /**
   * path 是请求的目标路径，不包括域名但可能包含查询字符串之前的路径参数。
   */
  @Prop({ index: true })
  path: string

  /**
   * query 记录了请求中的查询字符串部分，通常用来传递过滤或分页参数。
   */
  @Prop({ type: Schema.Types.Mixed })
  query: Record<string, unknown>

  /**
   * params 存储路径参数，这些是嵌入在请求路径中的变量。
   */
  @Prop({ type: Schema.Types.Mixed })
  params: Record<string, unknown>

  /**
   * requestBody 包含客户端发送的原始请求体内容。
   */
  @Prop({ maxlength: 1100, trim: true })
  requestBody: string

  /**
   * ip 记录了发起请求的客户端的IP地址。
   */
  @Prop()
  ip: string

  /**
   * userAgent 包含了客户端的 User-Agent 字符串，可以用来识别客户端。
   */
  @Prop()
  userAgent: string

  /**
   * invokeClass 表示处理该请求的服务端(Controller)类名。
   */
  @Prop()
  invokeClass: string

  /**
   * invokeMethod 是服务端处理该请求的方法名。
   */
  @Prop()
  invokeMethod: string

  /**
   * elapsedTime 记录了从接收请求到发送响应所花费的时间, 单位: 毫秒。
   */
  @Prop()
  elapsedTime: number

  /**
   * timestamp 是请求被接收的时间戳，Unix 时间戳。
   */
  @Prop()
  timestamp: number

  /**
   * response 包含了服务器返回给客户端的响应体内容。
   */
  @Prop({ maxlength: 1100, trim: true })
  response: string

  /**
   * httpCode 表示服务器返回给客户端的HTTP状态码。
   */
  @Prop({ index: true })
  httpCode: number

  // static configureSchema(schema: Schema) {}
}
