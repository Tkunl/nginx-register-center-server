import { NginxCodeEnum } from 'src/common/enum/sys-code.enum'
import { BizException } from 'src/common/exception/biz.exception'

export class NginxConfigWriteFailedException extends BizException {
  constructor() {
    super(NginxCodeEnum.CONFIG_WRITE_FAILED, 'Nginx config write failed')
  }
}
