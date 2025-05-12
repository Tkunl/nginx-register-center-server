import { Module } from '@nestjs/common'
import { MongooseModule } from '@nestjs/mongoose'
import { NxConfigTddController } from './controller/nginx-config-tdd.controller'
import { NxConfigController } from './controller/nginx-config.controller'
import { AppInfoName, AppInfoSchema } from './schema/app-info.schema'
import { DockerService } from './service/docker.service'
import { NginxConfigService } from './service/nginx-config.service'

@Module({
  controllers: [NxConfigTddController, NxConfigController],
  providers: [DockerService, NginxConfigService],
  imports: [
    MongooseModule.forFeature([
      {
        name: AppInfoName,
        schema: AppInfoSchema,
      },
    ]),
  ],
})
export class BizModule {}
