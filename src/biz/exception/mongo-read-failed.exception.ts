import { MongoErrorCode } from 'src/common/enum/sys-code.enum'
import { BizException } from 'src/common/exception/biz.exception'

export class MongoReadFailedException extends BizException {
  constructor() {
    super(MongoErrorCode.READ_FAILED, 'Failed to read from MongoDb')
  }
}
