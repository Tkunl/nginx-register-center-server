import { Controller, Post } from '@nestjs/common'
import { DockerService } from '../service/docker.service'
import { R } from 'src/common/po/r.po'

@Controller('docker')
export class DockerController {
  constructor(private dockerSvc: DockerService) {}

  @Post('restart-nginx-container')
  async restartNginxContainer() {
    await this.dockerSvc.restartNginxContainer()
    return R.ok()
  }
}
