import { Global, Module } from '@nestjs/common'
import { LockService } from './service/lock.service'

@Global()
@Module({
  imports: [],
  controllers: [],
  providers: [LockService],
  exports: [LockService],
})
export class CommonModule {}
