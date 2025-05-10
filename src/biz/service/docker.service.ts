import { Injectable, Logger } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import * as Docker from 'dockerode'
import { ContainerRestartFailedException } from '../exception/container-restart-failed.exception'
import { NginxContainerNotFoundException } from '../exception/nginx-container-not-found.exception'
import { DockerConnectException } from '../exception/docker-connect.exception'

@Injectable()
export class DockerService {
  private readonly logger = new Logger(DockerService.name)
  docker: Docker

  constructor(private configSvc: ConfigService) {
    try {
      this.docker = new Docker({
        socketPath: this.configSvc.get<string>('DOCKER_SOCKET_PATH'),
      })
    } catch (e) {
      this.logger.error(e)
      throw new DockerConnectException()
    }
  }

  async listContainers() {
    const containers = await this.docker.listContainers()
    return containers.map((c) => c.Names)
  }

  async getContainerInfos() {
    const containers = await this.docker.listContainers()
    return containers
  }

  async restartNginxContainer() {
    const containers = await this.docker.listContainers()
    const nginxConstainer = containers.filter((info) => info.Image.includes('nginx')).at(0)

    if (!nginxConstainer) {
      throw new NginxContainerNotFoundException()
    }

    const container = this.docker.getContainer(nginxConstainer.Id)

    try {
      await container.restart()
    } catch (e) {
      this.logger.error(e)
      throw new ContainerRestartFailedException()
    }
  }
}
