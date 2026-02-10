import { Module } from '@nestjs/common'
import { PrismaService } from './prisma/prisma.service'
import { ConfigModule } from '@nestjs/config'
import { CreateAccountController } from './controllers/create-account.controller'

@Module({
  imports: [ConfigModule.forRoot()],
  controllers: [CreateAccountController],
  providers: [PrismaService],
})
export class AppModule {}
