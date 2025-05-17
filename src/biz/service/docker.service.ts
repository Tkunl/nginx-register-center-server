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

  // TODO 此处显示拉到了镜像但实际查不到
  async pullImage(imageName: string) {
    return new Promise<void>((resolve, reject) => {
      this.docker.pull(imageName, { force: true }, (e: Error, stream: NodeJS.ReadableStream) => {
        if (e) {
          this.logger.error(e)
          return reject(e)
        }

        let buffer = ''
        stream.on('data', (chunk: Buffer) => {
          buffer += chunk.toString()

          // 尝试解析 JSON 数据
          try {
            const lines = buffer.trim().split('\n')
            buffer = '' // 清空已处理的数据

            lines.forEach((line) => {
              const event = JSON.parse(line)
              if (event.status && event.progress) {
                this.logger.log(`[Pulling] ${event.status} - ${event.progress}`)
              } else if (event.status) {
                this.logger.log(`[Status] ${event.status}`)
              }
            })
          } catch (parseError) {
            this.logger.warn('Failed to parse docker pull stream chunk:', parseError.message)
          }
        })

        stream.on('end', () => {
          this.logger.log(`Download Docker image: ${imageName} success`)
          resolve()
        })

        stream.on('error', (e) => {
          this.logger.error(e)
          reject(e)
        })
      })
    })
  }

  async restartNginxContainer() {
    const containers = await this.docker.listContainers()
    const nginxContainer = containers.filter((info) => info.Image.includes('nginx')).at(0)

    if (!nginxContainer) {
      throw new NginxContainerNotFoundException()
    }

    const container = this.docker.getContainer(nginxContainer.Id)

    try {
      await container.restart()
    } catch (e) {
      this.logger.error(e)
      throw new ContainerRestartFailedException()
    }
  }
}
