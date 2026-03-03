import { Injectable } from '@nestjs/common'
import Attachment from '@/domain/forum/enterprise/entities/attachment'
import AttachmentsRepository from '@/domain/forum/application/repositories/attachments-repository'
import InvalidAttachmentTypeError from '@/domain/forum/application/use-cases/errors/invalid-attachment-type.error'
import Uploader from '@/domain/forum/application/storage/uploader'

export type UploadAndCreateAttachmentInput = {
  fileName: string
  fileType: string
  fileContent: Buffer
}

type UploadAndCreateAttachmentOutput = {
  attachment: Attachment
}

@Injectable()
export default class UploadAndCreateAttachment {
  constructor(
    private attachmentsRepository: AttachmentsRepository,
    private uploader: Uploader,
  ) {}

  async execute({
    fileName,
    fileType,
    fileContent,
  }: UploadAndCreateAttachmentInput): Promise<UploadAndCreateAttachmentOutput> {
    if (!/^(image\/(jpeg|png)|application\/pdf)$/.test(fileType)) {
      throw new InvalidAttachmentTypeError(fileType)
    }

    const { url } = await this.uploader.upload({
      fileName,
      fileType,
      fileContent,
    })

    const attachment = Attachment.create({
      title: fileName,
      url,
    })

    await this.attachmentsRepository.create(attachment)

    return { attachment }
  }
}
