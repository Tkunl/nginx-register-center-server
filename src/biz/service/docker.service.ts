import { Injectable } from '@nestjs/common'
import * as Docker from 'dockerode'

@Injectable()
export class DockerService {
  dockerInstance: Docker

  constructor() {
    try {
      this.dockerInstance = new Docker({
        socketPath: '/var/run/docker.sock',
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
