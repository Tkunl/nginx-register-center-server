import { Controller, Get, Logger, Post } from '@nestjs/common'
import { R } from 'src/common/po/r.po'

@Controller('tdd')
export class BaseTddController {
  private readonly logger = new Logger(BaseTddController.name)

  constructor() {}

  @Get('hello')
  async getHelloWorld() {
    this.logger.error('hello~~~')
    return 'hello'
  }

  @Post('hello')
  async postHelloWorld() {
    return 'hello'
  }

  @Get('internal-error')
  async getInternalError() {
    const obj: any = undefined
    const notExist = obj.notExist
    return R.ok(notExist)
  }
}
