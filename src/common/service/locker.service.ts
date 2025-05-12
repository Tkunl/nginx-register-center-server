import { Injectable, Logger } from '@nestjs/common'
import { LockDirCreateFailedException } from '../exception/lock-dir-create-failed.exception'
import * as lockfile from 'proper-lockfile'
import * as path from 'path'
import * as fs from 'fs'

@Injectable()
export class LockerService {
  private readonly lockDir: string
  private readonly logger = new Logger(LockerService.name)

  // 默认配置（等待 5s，重试 10 次，每次间隔 500ms）
  private defaultOptions = {
    wait: 5000,
    retries: 10,
    retryWait: 500,
  }

  constructor() {
    // 设置锁文件目录为 process.cwd()/.lock
    this.lockDir = path.join(process.cwd(), '.lock')
    this.ensureLockDirExists()
  }

  private ensureLockDirExists() {
    if (!fs.existsSync(this.lockDir)) {
      try {
        fs.mkdirSync(this.lockDir, { recursive: true })
        this.logger.log('Created lock dir successful at: ' + this.lockDir)
      } catch (err) {
        throw new LockDirCreateFailedException(err.message)
      }
    }
  }

  /**
   * 获取锁
   * @param resource 锁的唯一标识（如文件名、配置项等）
   * @param options 可选的锁配置（覆盖默认值）
   * @returns 释放锁的函数
   */
  private async acquireLock(resource: string, options: Partial<lockfile.LockOptions> = {}) {
    const mergedOptions = { ...this.defaultOptions, ...options }
    const lockFilePath = path.join(this.lockDir, resource)

    if (!fs.existsSync(lockFilePath)) {
      fs.closeSync(fs.openSync(lockFilePath, 'w')) // 创建空文件
    }

    const release = await lockfile.lock(lockFilePath, mergedOptions)
    return release
  }

  /**
   * 释放锁
   * @param release 由 acquireLock 返回的释放函数
   */
  async releaseLock(release: () => Promise<void>) {
    if (release) {
      release()
    }
  }

  async getNginxConfigLock() {
    return await this.acquireLock('nginx-config')
  }
}
