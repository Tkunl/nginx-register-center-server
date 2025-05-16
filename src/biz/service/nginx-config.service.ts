import { Injectable, Logger } from '@nestjs/common'
import { AppInfoDto } from '../dto/app-info.dto'
import { Model } from 'mongoose'
import { AppInfo, AppInfoName } from '../schema/app-info.schema'
import { InjectModel } from '@nestjs/mongoose'
import { MongoWriteFailedException } from '../exception/mongo-write-failed.exception'
import { uuid } from 'src/common/utils/common-util'
import { MongoReadFailedException } from '../exception/mongo-read-failed.exception'
import { AppInfoWithAppIdDto } from '../dto/app-info-with-appid.dto'

@Injectable()
export class NginxConfigService {
  private readonly logger = new Logger(NginxConfigService.name)

  @InjectModel(AppInfoName)
  private appInfoModel: Model<AppInfo>

  async isAppNameExist(appName: string) {
    let flag: boolean = false
    try {
      flag = !!(await this.appInfoModel.exists({ appName }))
    } catch (e) {
      this.logger.error(e)
      throw new MongoReadFailedException()
    }
    return flag
  }

  async isAppIdExist(appId: string) {
    let flag: boolean = false
    try {
      flag = !!(await this.appInfoModel.exists({ appId }))
    } catch (e) {
      this.logger.error(e)
      throw new MongoReadFailedException()
    }
    return flag
  }

  async addAppConfig(appInfoDto: AppInfoDto) {
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

  async delAppConfigByAppId(appId: string) {
    try {
      const result = await this.appInfoModel.deleteOne({ appId }).exec()
      if (result.deletedCount !== 1) {
        return false
      }
      return true
    } catch (e) {
      this.logger.error(e)
      throw new MongoWriteFailedException()
    }
  }

  async editAppConfigByAppId(appInfoDto: AppInfoWithAppIdDto) {
    const { appId, ...updateData } = appInfoDto
    const now = Date.now()
    try {
      const result = await this.appInfoModel
        .findOneAndUpdate(
          { appId },
          {
            ...updateData,
            updateAt: now,
          },
          { new: true },
        )
        .exec()
      if (!result) {
        return false
      }
      return true
    } catch (e) {
      this.logger.error(e)
      throw new MongoWriteFailedException()
    }
  }
}
