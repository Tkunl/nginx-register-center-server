import { DockerErrorCode } from 'src/common/enum/sys-code.enum'
import { BizException } from 'src/common/exception/biz.exception'

export class ContainerRestartFailedException extends BizException {
  constructor() {
    super(DockerErrorCode.CONTAINER_RESTART_FAILED, 'Failed to restart container')
  }
}
