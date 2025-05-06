import { Request } from 'express'

export type BizRequest = Request & {
  requestId: string
}
