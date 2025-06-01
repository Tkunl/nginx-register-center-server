import { Injectable, Logger } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { Model } from 'mongoose'
import * as path from 'path'
import * as ejs from 'ejs'
import * as fsp from 'fs/promises'
import { uuid } from 'src/common/utils/common-util'
import { AppInfoWithAppIdDto } from '../dto/app-info-with-appid.dto'
import { AppInfoDto } from '../dto/app-info.dto'
import { MongoReadFailedException } from '../exception/mongo-read-failed.exception'
import { MongoWriteFailedException } from '../exception/mongo-write-failed.exception'
import { AppInfo, AppInfoName, EnvTag } from '../schema/app-info.schema'
import { NginxServerConfig } from '../types/nginx-server-config'
import { EjsTemplateReadFailedException } from '../exception/ejs-template-read-failed.exception'
import { LockerService } from 'src/common/service/locker.service'
import { ConfigService } from '@nestjs/config'
import { NginxConfigWriteFailedException } from '../exception/nginx-config-write-failed.exception'
import { ensureDirExists } from 'src/common/utils/fs-util'

@Injectable()
export class NginxConfigService {
  private readonly logger = new Logger(NginxConfigService.name)

  @InjectModel(AppInfoName)
  private appInfoModel: Model<AppInfo>

  constructor(
    private lockSvc: LockerService,
    private configSvc: ConfigService,
  ) {}

  async isAppNameExist(appName: string) {
    let flag: boolean = false
    try {
      flag = Boolean(await this.appInfoModel.exists({ appName }))
    } catch (e) {
      this.logger.error(e)
      throw new MongoReadFailedException()
    }
    return flag
  }

  async isAppIdExist(appId: string) {
    let flag: boolean = false
    try {
      flag = Boolean(await this.appInfoModel.exists({ appId }))
    } catch (e) {
      this.logger.error(e)
      throw new MongoReadFailedException()
    }
    return flag
  }

  async getAppNameByAppId(appId: string) {
    try {
      const appInfo = await this.appInfoModel.findOne({ appId }).exec()
      if (appInfo && appInfo.appName) {
        return appInfo.appName
      }
      return ''
    } catch (e) {
      this.logger.error(`Failed to get appName for appId ${appId}: ${e}`)
      throw new MongoReadFailedException()
    }
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
      return result.deletedCount === 1
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
      return result
    } catch (e) {
      this.logger.error(e)
      throw new MongoWriteFailedException()
    }
  }

  async getAllAppConfigs() {
    try {
      const appInfos = await this.appInfoModel.find().exec()
      if (Array.isArray(appInfos) && appInfos.length > 0) {
        return appInfos.flatMap((app: AppInfo) =>
          app.appConfig.map((envTag: EnvTag) => ({
            server_env: envTag.env,
            server_name: app.appName,
          })),
        ) as NginxServerConfig[]
      }
      return []
    } catch (e) {
      this.logger.error(e)
      throw new MongoReadFailedException()
    }
  }

  async generateNxConfig(configList: NginxServerConfig[]) {
    try {
      // Nginx 默认 server 块配置
      const defaultTemplatePath = path.join(process.cwd(), 'template', 'default.conf.ejs')
      const defaultTemplate = await fsp.readFile(defaultTemplatePath, 'utf8')
      // app server 块配置
      const serverTemplatePath = path.join(process.cwd(), 'template', 'server.conf.ejs')
      const serverTemplate = await fsp.readFile(serverTemplatePath, 'utf8')
      // Nginx 默认 server 块配置模板
      const defaultBlock = ejs.render(defaultTemplate)
      // app server 块模板
      const serverBlocks = configList
        .map((config) => ejs.render(serverTemplate, config))
        .join('\n\n')
      // 合并完整配置
      const fullConfig = `${defaultBlock}\n\n${serverBlocks}`
      return fullConfig
    } catch (e) {
      this.logger.error(e)
      throw new EjsTemplateReadFailedException()
    }
  }

  async writeNxConfig(config: string) {
    const lock = await this.lockSvc.getNginxConfigLock()
    try {
      const nxConfigPath = path.join(this.configSvc.get<string>('NGINX_CONFIG_PATH')!, 'nginx.conf')
      ensureDirExists(nxConfigPath)
      await fsp.writeFile(nxConfigPath, config, 'utf8')
    } catch (e) {
      this.logger.error(e)
      throw new NginxConfigWriteFailedException()
    } finally {
      await this.lockSvc.releaseLock(lock)
    }
  }
}
