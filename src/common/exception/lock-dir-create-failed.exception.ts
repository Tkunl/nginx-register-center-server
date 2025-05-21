import { LockerSvcErrorCode } from '../enum/sys-code.enum'
import { BizException } from './biz.exception'

export class LockDirCreateFailedException extends BizException {
  constructor(message: string) {
    super(LockerSvcErrorCode.LOCK_DIR_CREATE_FAILED, message)
  }
}
