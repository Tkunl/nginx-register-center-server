import { DockerCodeEnum } from 'src/common/enum/sys-code.enum'
import { BizException } from '../../common/exception/biz.exception'

export class DockerImagePullFailedException extends BizException {
  constructor() {
    super(DockerCodeEnum.IMAGE_PULL_FAILED, 'Docker image pull failed')
  }
}
