import { Injectable, Logger } from '@nestjs/common'
import { AppInfoDto } from '../dto/app-info.dto'
import { Model } from 'mongoose'
import { AppInfo, AppInfoName } from '../schema/app-info.schema'
import { InjectModel } from '@nestjs/mongoose'
import { MongoWriteFailedException } from '../exception/mongo-write-failed.exception'
import { uuid } from 'src/common/utils/common-util'
import { MongoReadFailedException } from '../exception/mongo-read-failed.exception'
import { AppNameExistedException } from '../exception/app-name-existed.exception'

@Injectable()
export class NginxConfigService {
  private readonly logger = new Logger(NginxConfigService.name)

  @InjectModel(AppInfoName)
  private appInfoModel: Model<AppInfo>

  private async isAppNameExist(appName: string) {
    let flag: boolean = false
    try {
      flag = !!(await this.appInfoModel.exists({ appName }))
    } catch (e) {
      this.logger.error(e)
      throw new MongoReadFailedException()
    }
    return flag
  }

  async addAppConfig(appInfoDto: AppInfoDto) {
    const isExisted = await this.isAppNameExist(appInfoDto.appName)
    if (isExisted) {
      throw new AppNameExistedException()
    }
    const now = Date.now()
    const appId = uuid()
    const createRecord = new this.appInfoModel({
      ...appInfoDto,
      appId,
      createdAt: now,
      updateAt: now,
    })

    try {
      await createRecord.save()
    } catch (e) {
      this.logger.error(e)
      throw new MongoWriteFailedException()
    }

    return appId
  }
}
