import { MongoCodeEnum } from 'src/common/enum/sys-code.enum'
import { BizException } from 'src/common/exception/biz.exception'

export class AppNameExistedException extends BizException {
  constructor() {
    super(MongoCodeEnum.APP_NAME_EXISTED, 'AppName existed')
  }
}
