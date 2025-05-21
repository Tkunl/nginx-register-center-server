import { DockerErrorCode } from 'src/common/enum/sys-code.enum'
import { BizException } from 'src/common/exception/biz.exception'

export class NginxContainerNotFoundException extends BizException {
  constructor() {
    super(DockerErrorCode.CONTAINER_NOT_FOUND, 'No nginx container found')
  }
}
