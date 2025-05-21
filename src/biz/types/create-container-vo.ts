export interface CreateContainerVo {
  image: string // 镜像名
  name?: string // 容器名
  hostConfig?: {
    // 新增 hostConfig 结构
    Binds?: string[]
    PortBindings?: Record<string, Array<{ HostPort: string }>>
  }
  Volumes?: {
    // 修正 Volumes 结构
    [containerPath: string]: object
  }
  Env?: string[] // 环境变量参数
}
