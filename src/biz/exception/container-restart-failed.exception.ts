import { DockerCodeEnum } from 'src/common/enum/sys-code.enum'
import { BizException } from 'src/biz/exception/biz.exception'

export class ContainerRestartFailedException extends BizException {
  constructor() {
    super(DockerCodeEnum.CONTAINER_RESTART_FAILED, 'Failed to restart container')
  }
}
