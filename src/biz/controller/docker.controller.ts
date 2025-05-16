import { Controller } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { LockerService } from 'src/common/service/locker.service'
import { DockerService } from '../service/docker.service'

@Controller('docker')
export class DockerController {
  constructor(
    private lockerSvc: LockerService,
    private configSvc: ConfigService,
    private dockerSvc: DockerService,
  ) {}
}
