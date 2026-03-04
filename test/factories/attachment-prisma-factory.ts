import { PrismaService } from '@/infra/database/prisma/prisma.service'
import makeAttachment from './make-attachment'
import { PrismaAttachmentMapper } from '@/infra/database/prisma/mappers/prisma-attachment.mapper'
import { Injectable } from '@nestjs/common'

@Injectable()
export default class AttachmentPrismaFactory {
  constructor(private prisma: PrismaService) {}

  async makePrismaAttachment() {
    const attachment = makeAttachment()

    await this.prisma.attachment.create({
      data: PrismaAttachmentMapper.toPersistent(attachment),
    })

    return attachment
  }
}
