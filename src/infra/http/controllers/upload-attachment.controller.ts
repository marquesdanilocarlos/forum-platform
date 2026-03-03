import {
  Controller,
  Post,
  UseInterceptors,
  UploadedFile,
  BadRequestException,
} from '@nestjs/common'
import { FileInterceptor, File } from '@nest-lab/fastify-multer'
import { FastifyRequest } from 'fastify'

@Controller('/attachments')
export class UploadAttachmentController {
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
  upload(@UploadedFile() file: File) {
    return {
      originalname: file.originalname,
      size: file.size,
      mimetype: file.mimetype,
    }
  }
}
