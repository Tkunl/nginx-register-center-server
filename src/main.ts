import { ValidationPipe } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { NestFactory } from '@nestjs/core'
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger'
import { AppModule } from './app.module'
import { GlobalExceptionFilter } from './core/filters/global-exception.filter'

async function bootstrap() {
  const app = await NestFactory.create(AppModule)
  const configSvc = app.get(ConfigService)

  // 启用 class-validator 验证
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // 过滤未定义字段
      transform: true, // 自动转换类型
      forbidNonWhitelisted: true, // 禁止非白名单字段
    }),
  )
  // 启用 全局异常处理
  app.useGlobalFilters(new GlobalExceptionFilter())

  const config = new DocumentBuilder()
    .setTitle('Nginx Register Center Server')
    .setDescription('api documentation')
    .setVersion('1.0')
    .build()
  const document = SwaggerModule.createDocument(app, config)
  SwaggerModule.setup('api-doc', app, document)

  app.enableCors()

  await app.listen(configSvc.get<number>('serverPort') ?? 3000)
}
bootstrap()
