import { isNotNil } from 'es-toolkit'
import { SysCodeEnum } from '../enum/sys-code.enum'

// TODO 待优化
export class R {
  statusCode: number
  message: string
  data: unknown
  error: string

  constructor(statusCode: number, message?: string, data?: unknown, error?: string) {
    this.statusCode = statusCode
    if (message) this.message = message
    if (isNotNil(data)) this.data = data
    if (error) this.error = error
  }

  static ok(): R
  static ok(data: unknown): R
  static ok(data?: unknown): R {
    if (isNotNil(data)) {
      return new R(SysCodeEnum.OK, 'success', data)
    }
    return new R(SysCodeEnum.OK, 'success')
  }

  static error(code: SysCodeEnum): R
  static error(code: SysCodeEnum, msg: string): R
  static error(code: SysCodeEnum, msg: string, data: unknown): R
  static error(code = SysCodeEnum.ERROR, msg?: string, data?: unknown): R {
    const r = new R(code, msg)
    if (data) {
      r.data = data
    }
    return r
  }
}
