export class R<T = unknown> {
  requestId: string
  timestamp: number
  code: number
  message: string
  data: T
}
