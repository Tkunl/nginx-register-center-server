import { Module } from '@nestjs/common'
import { MongooseModule } from '@nestjs/mongoose'
import { DockerTddController } from './controller/docker-tdd.controller'
import { DockerController } from './controller/docker.controller'
import { NxConfigTddController } from './controller/nginx-config-tdd.controller'
import { NxConfigController } from './controller/nginx-config.controller'
import { AppInfoName, AppInfoSchema } from './schema/app-info.schema'
import { DockerService } from './service/docker.service'
import { NginxConfigService } from './service/nginx-config.service'

@Module({
  controllers: [NxConfigTddController, NxConfigController, DockerTddController, DockerController],
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
