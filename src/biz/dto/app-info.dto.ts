import { Type } from 'class-transformer'
import { IsArray, IsNotEmpty, IsString, ValidateNested } from 'class-validator'

class EnvTag {
  @IsString()
  @IsNotEmpty()
  env: string

  @IsArray()
  @IsString({ each: true })
  tags: string[]
}

export class AppInfoDto {
  @IsString()
  @IsNotEmpty()
  appName: string

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => EnvTag)
  appConfig: EnvTag[]
}
