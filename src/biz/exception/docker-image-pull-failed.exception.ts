import { DockerErrorCode } from 'src/common/enum/sys-code.enum'
import { BizException } from '../../common/exception/biz.exception'

export class DockerImagePullFailedException extends BizException {
  constructor() {
    super(DockerErrorCode.IMAGE_PULL_FAILED, 'Docker image pull failed')
  }
}
