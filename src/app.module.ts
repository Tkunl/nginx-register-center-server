import { Module } from '@nestjs/common'
import { ConfigModule, ConfigService } from '@nestjs/config'
import { projectConfig } from './core/config/project.config'
import { MongooseModule } from '@nestjs/mongoose'
import { CoreModule } from './core/core.module'
import { CommonModule } from './common/common.module'
import { BizModule } from './biz/biz.module'

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [projectConfig], // 加载 yaml 项目配置
      envFilePath: `.env.${process.env.NODE_ENV}`, // 加载 env 环境配置
    }),
    MongooseModule.forRootAsync({
      useFactory(configSvc: ConfigService) {
        return {
          uri: configSvc.get<string>('MONGODB_URL'),
        }
      },
      inject: [ConfigService],
    }),
    CoreModule,
    CommonModule,
    BizModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
