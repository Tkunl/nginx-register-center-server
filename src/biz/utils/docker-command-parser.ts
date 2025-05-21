import { CreateContainerVo } from '../types/create-container-vo'

export class DockerCommandParser {
  // 将命令行分解为语义化 token（简化实现）
  private static tokenizeCommand(command: string): string[] {
    return command
      .split(/(\s+|--\w+)|("[^"]+")/g) // 分割参数并保留带空格的路径
      .filter((t) => t && t.trim() !== '')
      .map((t) => t.replace(/^"|"$/g, '')) // 去除包裹的引号
  }

  // 标准化参数名称（映射短参数到长参数）
  private static normalizeArgName(arg: string): string {
    const mapping: Record<string, string> = {
      '-d': 'detach',
      '--detach': 'detach',
      '--name': 'name',
      '-p': 'publish',
      '--publish': 'publish',
      '-v': 'volume',
      '--volume': 'volume',
    }
    return mapping[arg] || arg.replace(/^-+/, '')
  }

  static parseRunCommand(command: string): CreateContainerVo {
    const args = this.tokenizeCommand(command)
    const params: CreateContainerVo = {
      image: '',
      hostConfig: {},
      Volumes: {},
    }
    let currentArgType: string | null = null

    for (let i = 0; i < args.length; i++) {
      const arg = args[i]

      // 处理参数前缀（短参数/长参数）
      if (arg.startsWith('-')) {
        currentArgType = this.normalizeArgName(arg)
        continue
      }

      // 根据当前参数类型处理值
      switch (currentArgType) {
        case 'detach': {
          // -d 参数无需处理值
          currentArgType = null
          break
        }
        case 'name': {
          params.name = arg
          currentArgType = null
          break
        }
        case 'publish': {
          // 端口映射
          const [hostPort, containerPort] = arg.split(':')
          const [portNum, protocol = 'tcp'] = containerPort.split('/')
          const portKey = `${portNum}/${protocol}`

          params.hostConfig!.PortBindings = params.hostConfig!.PortBindings || {}
          params.hostConfig!.PortBindings[portKey] = [{ HostPort: hostPort }]
          break
        }
        case 'volume': {
          const [hostPath, containerPath] = arg.split(':')
          // 填充 Binds 和 Volumes [4,6](@ref)
          params.hostConfig!.Binds = params.hostConfig!.Binds || []
          params.hostConfig!.Binds.push(`${hostPath}:${containerPath}`)
          params.Volumes![containerPath.split(':')[0]] = {} // 取容器路径第一部分
          break
        }
        case 'env': {
          // 新增环境变量处理[7](@ref)
          params.Env = params.Env || []
          params.Env.push(arg)
          break
        }
        default: {
          // 处理镜像名称（最后一个非选项参数）
          if (!arg.startsWith('-') && i === args.length - 1) {
            params.image = arg
          }
        }
      }
      currentArgType = null // 重置参数类型
    }

    return params
  }
}
