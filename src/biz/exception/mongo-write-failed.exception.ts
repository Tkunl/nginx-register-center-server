import { MongoCodeEnum } from 'src/common/enum/sys-code.enum'
import { BizException } from 'src/common/exception/biz.exception'

export class MongoWriteFailedException extends BizException {
  constructor() {
    super(MongoCodeEnum.WRITE_FAILED, 'Failed to write into MongoDb')
  }
}
