import { Body, Controller, Post } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { R } from 'src/common/po/r.po'
import { LockerService } from 'src/common/service/locker.service'
import { AppInfoDto } from '../dto/app-info.dto'
import { NginxConfigService } from '../service/nginx-config.service'
import { NginxCodeEnum } from 'src/common/enum/sys-code.enum'

@Controller('nx-config')
export class NxConfigController {
  constructor(
    private lockerSvc: LockerService,
    private configSvc: ConfigService,
    private nxConfigSvc: NginxConfigService,
  ) {}

  @Post('app-config/add')
  async addAppConfig(@Body() appInfoDto: AppInfoDto) {
    const isExist = await this.nxConfigSvc.isAppNameExist(appInfoDto.appName)
    if (isExist) {
      return R.error(NginxCodeEnum.APP_NAME_EXISTED, '应用名已存在!')
    }
    const appId = await this.nxConfigSvc.addAppConfig(appInfoDto)
    return R.ok(appId)
  }
}
