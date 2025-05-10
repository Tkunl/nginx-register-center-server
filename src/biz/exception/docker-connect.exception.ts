import { DockerCodeEnum } from 'src/common/enum/sys-code.enum'
import { BizException } from './biz.exception'

export class DockerConnectException extends BizException {
  constructor() {
    super(DockerCodeEnum.DOCKER_CONNECT_ERROR, 'Failed to connect with docker')
  }
}
