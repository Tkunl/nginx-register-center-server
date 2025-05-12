import { Global, Module } from '@nestjs/common'
import { LockerService } from './service/locker.service'

@Global()
@Module({
  imports: [],
  controllers: [],
  providers: [LockerService],
  exports: [LockerService],
})
export class CommonModule {}
