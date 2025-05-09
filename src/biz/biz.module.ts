import { Module } from '@nestjs/common'
import { NxConfigTddController } from './controller/nginx-config-tdd.controller'
import { DockerService } from './service/docker.service'

@Module({
  controllers: [NxConfigTddController],
  providers: [DockerService],
  exports: [],
})
export class BizModule {}
