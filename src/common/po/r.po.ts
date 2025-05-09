import { isNotNil } from 'es-toolkit'
import { SysCodeEnum } from '../../core/enum/sys-code.enum'

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
      return new R(SysCodeEnum.OK, 'ok', data)
    }
    return new R(SysCodeEnum.OK, 'ok')
  }

  static error(code: SysCodeEnum): R
  static error(code: SysCodeEnum, msg: string): R
  static error(code?: SysCodeEnum, msg?: string): R {
    return new R(code ?? SysCodeEnum.ERROR, msg ?? 'error')
  }
}
