import { Controller, Get } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import * as ejs from 'ejs'
import * as fsp from 'fs/promises'
import * as path from 'path'
import { R } from 'src/common/po/r.po'
import { DockerService } from '../service/docker.service'

@Controller('nx-config-tdd')
export class NxConfigTddController {
  constructor(
    private dockerSvc: DockerService,
    private configSvc: ConfigService,
  ) {}

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

    await fsp.writeFile(
      path.join(this.configSvc.get<string>('NGINX_CONFIG_PATH')!, 'nginx.test.conf'),
      fullConfig,
      'utf8',
    )

    return R.ok()
  }

  @Get('list-containers')
  async listContainers() {
    const list = await this.dockerSvc.listContainers()
    return R.ok(list)
  }
}
