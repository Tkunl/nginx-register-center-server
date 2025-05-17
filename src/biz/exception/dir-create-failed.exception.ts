import { DockerCodeEnum } from 'src/common/enum/sys-code.enum'
import { BizException } from '../../common/exception/biz.exception'

export class DirCreateFailedException extends BizException {
  constructor() {
    super(DockerCodeEnum.DOCKER_CONNECT_ERROR, 'Failed to connect with docker')
  }
}
