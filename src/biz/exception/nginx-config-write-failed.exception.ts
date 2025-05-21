import { NginxErrorCode } from 'src/common/enum/sys-code.enum'
import { BizException } from 'src/common/exception/biz.exception'

export class NginxConfigWriteFailedException extends BizException {
  constructor() {
    super(NginxErrorCode.CONFIG_WRITE_FAILED, 'Nginx config write failed')
  }
}
