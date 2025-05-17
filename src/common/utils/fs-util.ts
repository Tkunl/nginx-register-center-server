import { Logger } from '@nestjs/common'
import * as fsp from 'fs/promises'

const logger = new Logger('fs-util')

async function ensureDirExists(dirPath: string) {
  try {
    // 检测目录是否存在
    await fsp.access(dirPath, fsp.constants.F_OK)
  } catch (error) {
    if (error.code === 'ENOENT') {
      // 递归创建目录（包含父级目录
      await fsp.mkdir(dirPath, { recursive: true })
    } else {
      logger.error(error.message)
      throw new Error(error.message)
    }
  }
}

export { ensureDirExists }
