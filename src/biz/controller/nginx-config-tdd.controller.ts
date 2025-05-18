import { Body, Controller, Get, Post } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import * as ejs from 'ejs'
import * as fsp from 'fs/promises'
import * as path from 'path'
import { R } from 'src/common/po/r.po'
import { DockerService } from '../service/docker.service'
import { LockerService } from 'src/common/service/locker.service'

@Controller('nx-config-tdd')
export class NxConfigTddController {
  constructor(
    private dockerSvc: DockerService,
    private lockSvc: LockerService,
    private configSvc: ConfigService,
  ) {}

  /**
   * 测试生成 Nginx 配置文件
   */
  @Get('generate')
  async generateNxConfig() {
    // 读取模板文件
    const defaultTemplatePath = path.join(process.cwd(), 'template', 'default.conf.ejs')
    const serverTemplatePath = path.join(process.cwd(), 'template', 'server.conf.ejs')

    const defaultTemplate = await fsp.readFile(defaultTemplatePath, 'utf8')
    const serverTemplate = await fsp.readFile(serverTemplatePath, 'utf8')

    const defaultBlock = ejs.render(defaultTemplate)

    const serverList = [
      {
        server_tag: 'dev',
        server_name: 'my-project',
      },
      {
        server_tag: 'test',
        server_name: 'my-project',
      },
      {
        server_tag: 'prod',
        server_name: 'my-project',
      },
    ]

    // 渲染子域名配置块
    const serverBlocks = serverList.map((config) => ejs.render(serverTemplate, config)).join('\n\n')

    // 合并完整配置
    const fullConfig = `${defaultBlock}\n\n${serverBlocks}`

    // 写入配置
    await fsp.writeFile(
      path.join(this.configSvc.get<string>('NGINX_CONFIG_PATH')!, 'nginx.test.conf'),
      fullConfig,
      'utf8',
    )

    return R.ok()
  }

  /**
   * 查看所有容器详细信息
   */
  @Get('container-infos')
  async getContainerInfos() {
    const infos = await this.dockerSvc.getContainerInfos()
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
   * 测试 Locker Servcie
   */
  @Get('lock-config')
  async tryLock() {
    const lock = await this.lockSvc.getNginxConfigLock()
    try {
      console.log('开始写入配置...')
      // 模拟写入配置文件
      await new Promise((resolve) => setTimeout(resolve, 2000))
      console.log('配置写入完成!')
    } finally {
      await this.lockSvc.releaseLock(lock)
      console.log('锁已释放')
    }
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

  @Post('run-container')
  async runContainer(@Body('cmd') cmd: string) {
    const containerInfo = await this.dockerSvc.runContainer(cmd)
    return R.ok(containerInfo)
  }

  @Post('stop-container')
  async stopContainer(@Body('id') id: string) {
    const containerInfo = await this.dockerSvc.stopContainer(id)
    return R.ok(containerInfo)
  }
}
