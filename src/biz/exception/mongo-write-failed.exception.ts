import { MongoErrorCode } from 'src/common/enum/sys-code.enum'
import { BizException } from 'src/common/exception/biz.exception'

export class MongoWriteFailedException extends BizException {
  constructor() {
    super(MongoErrorCode.WRITE_FAILED, 'Failed to write into MongoDb')
  }
}
