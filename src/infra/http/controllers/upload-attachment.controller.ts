import {
  Controller,
  Post,
  UseInterceptors,
  UploadedFile,
  BadRequestException,
} from '@nestjs/common'
import { FileInterceptor, File } from '@nest-lab/fastify-multer'
import { FastifyRequest } from 'fastify'
import UploadAndCreateAttachment from '@/domain/forum/application/use-cases/upload-and-create-attachment'
import InvalidAttachmentTypeError from '@/domain/forum/application/use-cases/errors/invalid-attachment-type.error'

@Controller('/attachments')
export class UploadAttachmentController {
  constructor(private uploadAndCreateAttachment: UploadAndCreateAttachment) {}

  @Post()
  @UseInterceptors(
    FileInterceptor('file', {
      limits: {
        fileSize: 2 * 1024 * 1024,
      },
      fileFilter: (req: FastifyRequest, file: File, callback) => {
        const allowedMimes = [
          'image/jpeg',
          'image/png',
          'image/gif',
          'application/pdf',
        ]

        if (!allowedMimes.includes(file.mimetype)) {
          return callback(new BadRequestException('Invalid file type'), false)
        }

        callback(null, true)
      },
    }),
  )
  async upload(@UploadedFile() file: File) {
    try {
      const { attachment } = await this.uploadAndCreateAttachment.execute({
        fileName: file.originalname,
        fileType: file.mimetype,
        fileContent: file.buffer ?? Buffer.from(''),
      })

      return { attachmentId: attachment.id.value }
    } catch (error: unknown) {
      if (error instanceof InvalidAttachmentTypeError) {
        throw new BadRequestException(error.message)
      }

      throw error
    }
  }
}
