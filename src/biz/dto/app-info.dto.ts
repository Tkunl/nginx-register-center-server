class EnvTag {
  env: string
  tags: string[]
}

export class AppInfoDto {
  appName: string
  appConfig: EnvTag[]
}
