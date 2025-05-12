import { Body, Controller, Post } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { R } from 'src/common/po/r.po'
import { LockerService } from 'src/common/service/locker.service'
import { AppInfoDto } from '../dto/app-info.dto'
import { NginxConfigService } from '../service/nginx-config.service'

@Controller('nx-config')
export class NxConfigController {
  constructor(
    private lockerSvc: LockerService,
    private configSvc: ConfigService,
    private nxConfigSvc: NginxConfigService,
  ) {}

  @Post('app-config/add')
  async addAppConfig(@Body() appInfoDto: AppInfoDto) {
    const appId = await this.nxConfigSvc.addAppConfig(appInfoDto)
    return R.ok(appId)
  }
}
