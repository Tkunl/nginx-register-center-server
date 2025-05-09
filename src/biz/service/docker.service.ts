import { Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import * as Docker from 'dockerode'

@Injectable()
export class DockerService {
  dockerInstance: Docker

  constructor(private configSvc: ConfigService) {
    try {
      this.dockerInstance = new Docker({
        socketPath: this.configSvc.get<string>('DOCKER_SOCKET_PATH'),
      })
    } catch (e) {
      console.error(e)
      throw e
    }
  }

  async listContainers() {
    const containers = await this.dockerInstance.listContainers()
    return containers.map((c) => c.Names)
  }
}
