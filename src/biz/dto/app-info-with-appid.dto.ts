import { IsString } from 'class-validator'
import { AppInfoDto } from './app-info.dto'

export class AppInfoWithAppIdDto extends AppInfoDto {
  @IsString()
  appId: string
}
