import { LockCodeEnum } from '../enum/sys-code.enum'
import { BizException } from './biz.exception'

export class LockDirCreateFailedException extends BizException {
  constructor(message: string) {
    super(LockCodeEnum.LOCK_DIR_CREATE_FAILED, message)
  }
}
