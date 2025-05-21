import { NginxErrorCode } from 'src/common/enum/sys-code.enum'
import { BizException } from 'src/common/exception/biz.exception'

export class EjsTemplateReadFailedException extends BizException {
  constructor() {
    super(NginxErrorCode.EJS_TEMPLATE_READ_FAILED, 'Failed to read ejs template')
  }
}
