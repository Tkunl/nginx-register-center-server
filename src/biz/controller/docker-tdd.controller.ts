import { Body, Controller, Get, Post } from '@nestjs/common'
import { DockerService } from '../service/docker.service'
import { R } from 'src/common/po/r.po'

@Controller('docker-tdd')
export class DockerTddController {
  constructor(private dockerSvc: DockerService) {}

  /**
   * 查看所有容器详细信息
   */
  @Get('container-infos')
  async getContainerInfos() {
    const infos = await this.dockerSvc.getContainerInfos()
    return R.ok(infos)
  }

  /**
   * 获取镜像详细信息
   */
  @Get('images-infos')
  async getImagesInfos() {
    const infos = await this.dockerSvc.getImagesInfos()
    return R.ok(infos)
  }

  /**
   * 测试重启 Nginx 容器
   */
  @Get('restart-nginx-container')
  async restartNginxContainer() {
    await this.dockerSvc.restartNginxContainer()
    return R.ok()
  }

  /**
   * 拉 Nginx 镜像
   * 需要使用 sudo docker images 才能看到
   */
  @Get('pull-nginx-image')
  async pullDockerImage() {
    await this.dockerSvc.pullImage('nginx:1.27.5-alpine')
    return R.ok()
  }

  /**
   * 测试解析 docker 命令
   */
  @Post('parse-docker-cmd')
  async parseDockerCmd(@Body('cmd') cmd: string) {
    const param = await this.dockerSvc.parseDockerCmd(cmd)
    return R.ok(param)
  }

  /**
   * 启动 Docker 容器
   */
  @Post('run-container')
  async runContainer(@Body('cmd') cmd: string) {
    const containerInfo = await this.dockerSvc.runContainer(cmd)
    return R.ok(containerInfo)
  }

  /**
   * 停止 Docker 容器
   */
  @Post('stop-container')
  async stopContainer(@Body('id') id: string) {
    const containerInfo = await this.dockerSvc.stopContainer(id)
    return R.ok(containerInfo)
  }
}
