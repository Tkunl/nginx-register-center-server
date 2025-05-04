import { Controller, Get, Post } from '@nestjs/common'

@Controller('tdd')
export class TddController {
  @Get('hello')
  async getHelloWorld() {
    return 'hello'
  }

  @Post('hello')
  async postHelloWorld() {
    return 'hello'
  }
}
