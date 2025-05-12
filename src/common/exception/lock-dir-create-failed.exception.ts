import { LockerCodeEnum } from '../enum/sys-code.enum'
import { BizException } from './biz.exception'

export class LockDirCreateFailedException extends BizException {
  constructor(message: string) {
    super(LockerCodeEnum.LOCK_DIR_CREATE_FAILED, message)
  }
}
