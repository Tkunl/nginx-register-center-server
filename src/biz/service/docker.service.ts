import { Injectable, Logger } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import * as Docker from 'dockerode'
import { ContainerRestartFailedException } from '../exception/container-restart-failed.exception'
import { NginxContainerNotFoundException } from '../exception/nginx-container-not-found.exception'
import { DockerConnectException } from '../exception/docker-connect.exception'
import { DockerImagePullFailedException } from '../exception/docker-image-pull-failed.exception'
import { DockerCommandParser } from '../utils/docker-command-parser'
import { ContainerStatus } from '../enum/container-status.enum'

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

  async getContainerInfos() {
    const containers = await this.docker.listContainers()
    return containers
  }

  async parseDockerCmd(cmd: string) {
    return DockerCommandParser.parseRunCommand(cmd)
  }

  /**
   * 需要使用 root 用户查看拉到的镜像
   */
  async pullImage(imageName: string) {
    return new Promise<void>((resolve, reject) => {
      const startTime = Date.now()
      this.logger.log(`Starting to pull Docker image: ${imageName}...`)
      this.docker.pull(imageName, (e: Error, stream: NodeJS.ReadableStream) => {
        if (e) {
          this.logger.error(e)
          throw new DockerImagePullFailedException()
        }

        const processStream = (chunk: Buffer) => {
          const lines = chunk
            .toString()
            .split('\n')
            .filter((l) => l.trim())
          lines.forEach((line) => {
            try {
              const { status, id, progress } = JSON.parse(line)
              if (status === 'Downloading') {
                this.logger.log(`Downloading layer ${id?.slice(0, 12)}: ${progress}`)
              } else if (status === 'Extracting') {
                this.logger.log(`Extracting layer ${id?.slice(0, 12)}: ${progress}`)
              }
              // eslint-disable-next-line @typescript-eslint/no-unused-vars
            } catch (e) {
              // 忽略非JSON内容
            }
          })
        }

        stream.on('data', processStream)

        stream.on('end', () => {
          const duration = Date.now() - startTime
          this.logger.log(`Successfully pulled image: ${imageName} (took ${duration}ms)`)
          resolve()
        })

        stream.on('error', (e) => {
          this.logger.error(e)
          reject(new DockerImagePullFailedException())
        })
      })
    })
  }

  // TODO 此处可以正常跑起来, 但 Nginx 配置文件可能存在问题
  async runContainer(cmd: string) {
    const containerConfig = DockerCommandParser.parseRunCommand(cmd)
    const container = await this.docker.createContainer(containerConfig)
    await container.start()
    return {
      id: container.id,
      status: ContainerStatus.RUNNING,
    }
  }

  // TODO 待测试
  async stopContainer(containerId: string) {
    const container = this.docker.getContainer(containerId)
    await container.stop()
    return { id: containerId, status: ContainerStatus.STOP }
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
