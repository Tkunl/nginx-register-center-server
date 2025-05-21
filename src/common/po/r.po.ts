import { isNotNil } from 'es-toolkit'
import { DefaultCode } from '../enum/sys-code.enum'

export class R<T = unknown> {
  code: number
  message: string
  data?: T

  constructor(code: number, message: string, data?: T) {
    this.code = code
    this.message = message
    this.data = data
  }

  static ok(): R
  static ok<T = unknown>(data: T): R
  static ok<T = unknown>(data?: T): R {
    if (isNotNil(data)) {
      return new R(DefaultCode.OK, 'ok', data)
    }
    return new R(DefaultCode.OK, 'ok')
  }

  static error(code?: number): R
  static error(code: number): R
  static error(code: number, msg: string): R
  static error<T>(code: number, msg: string, data: T): R
  static error<T>(code?: number, msg?: string, data?: T): R {
    return new R(code ?? DefaultCode.ERROR, msg ?? 'error', data)
  }
}
