import { DockerErrorCode } from 'src/common/enum/sys-code.enum'
import { BizException } from '../../common/exception/biz.exception'

export class DockerConnectException extends BizException {
  constructor() {
    super(DockerErrorCode.DOCKER_CONNECT_ERROR, 'Failed to connect with docker')
  }
}
