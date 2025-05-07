import { Controller, Get } from '@nestjs/common'
import * as path from 'path'
import * as fs from 'fs'
import ejs from 'ejs'

@Controller('nx-config-tdd')
export class NxConfigTddController {
  configPath: '/home/tkunl/Docker/nginx/conf.d/'

  @Get('generate')
  generateNxConfig() {
    console.log('path.join', path)
    console.log('fs', fs)
    console.log('path.join')
    // 读取模板文件
    // const defaultTemplatePath = path.join(process.cwd(), 'templates', 'default.conf.ejs')
    // const serverTemplatePath = path.join(process.cwd(), 'templates', 'server.conf.ejs')

    // console.log('defaultTemplatePath', defaultTemplatePath)
    // console.log('serverTemplatePath', serverTemplatePath)

    // const defaultTemplate = fs.readFileSync(defaultTemplatePath, 'utf8')
    // const serverTemplate = fs.readFileSync(serverTemplatePath, 'utf8')

    // const defaultBlock = ejs.render(defaultTemplate)

    // const subdomains = [
    //   {
    //     server_name: 'dev.my-project.com',
    //     root: '/usr/share/nginx/html/my-project/dev',
    //     index: 'index.html index.htm',
    //   },
    //   {
    //     server_name: 'test.my-project.com',
    //     root: '/usr/share/nginx/html/my-project/test',
    //     index: 'index.html index.htm',
    //   },
    //   {
    //     server_name: 'prod.my-project.com',
    //     root: '/usr/share/nginx/html/my-project/prod',
    //     index: 'index.html index.htm',
    //   },
    // ]

    // // 渲染子域名配置块
    // const serverBlocks = subdomains.map((config) => ejs.render(serverTemplate, config)).join('\n\n')

    // // 合并完整配置
    // const fullConfig = `${defaultBlock}\n\n${serverBlocks}`

    // console.log('process.cwd()', process.cwd())
    // return fullConfig
    return 'ok'
  }
}
