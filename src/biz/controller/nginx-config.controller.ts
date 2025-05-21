import { Body, Controller, Post } from '@nestjs/common'
import { NginxErrorCode } from 'src/common/enum/sys-code.enum'
import { R } from 'src/common/po/r.po'
import { AppInfoWithAppIdDto } from '../dto/app-info-with-appid.dto'
import { AppInfoDto } from '../dto/app-info.dto'
import { NginxConfigService } from '../service/nginx-config.service'

@Controller('nx-config')
export class NxConfigController {
  constructor(private nxConfigSvc: NginxConfigService) {}

  @Post('app-config/add')
  async addAppConfig(@Body() appInfoDto: AppInfoDto) {
    const isExist = await this.nxConfigSvc.isAppNameExist(appInfoDto.appName)
    if (isExist) {
      return R.error(NginxErrorCode.APP_NAME_EXIST, 'App name existed')
    }
    const appId = await this.nxConfigSvc.addAppConfig(appInfoDto)
    return R.ok(appId)
  }

  @Post('app-config/delete')
  async deleteAppConfig(@Body('appId') appId: string) {
    const flag = await this.nxConfigSvc.delAppConfigByAppId(appId)
    if (!flag) {
      return R.error(NginxErrorCode.APP_CONFIG_NOT_EXIST, 'App config not exist')
    }
    return R.ok()
  }

  @Post('app-config/edit')
  async editAppConfig(@Body() appInfoDto: AppInfoWithAppIdDto) {
    const flag = await this.nxConfigSvc.editAppConfigByAppId(appInfoDto)
    if (!flag) {
      return R.error(NginxErrorCode.APP_CONFIG_NOT_EXIST, 'App config not exist')
    }
    return R.ok()
  }

  @Post('app-config/generate')
  async generateNxConfig() {
    const configs = await this.nxConfigSvc.getAllAppConfigs()
    const configText = await this.nxConfigSvc.generateNxConfig(configs)
    await this.nxConfigSvc.writeNxConfig(configText)
    return R.ok()
  }
}
