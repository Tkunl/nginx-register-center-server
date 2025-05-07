import { Controller, Get, Post } from '@nestjs/common'

@Controller('tdd')
export class BaseTddController {
  @Get('hello')
  async getHelloWorld() {
    return 'hello'
  }

  @Post('hello')
  async postHelloWorld() {
    return 'hello'
  }

  @Get('internal-error')
  async getInternalError() {
    const obj: any = undefined
    return obj.notExist
  }
}
