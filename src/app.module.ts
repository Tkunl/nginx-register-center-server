import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config';
import { projectConfig } from './core/config/project.config';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [projectConfig],
    }),
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
