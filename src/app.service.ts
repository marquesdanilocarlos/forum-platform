import { Injectable } from '@nestjs/common'
import { PrismaService } from './prisma/prisma.service'

@Injectable()
export class AppService {
  constructor(private prisma: PrismaService) {}

  async getHello() {
    const user = await this.prisma.user.findFirst({
      where: {
        id: '0e1a63ee-bef4-4e25-9dd1-f376324a14e4',
      },
    })
    return user
  }
}
