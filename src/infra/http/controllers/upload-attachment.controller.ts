import { Controller, Post, UseInterceptors, UploadedFile } from '@nestjs/common'
import { FileInterceptor, File } from '@nest-lab/fastify-multer'

@Controller('/attachments')
export class UploadAttachmentController {
  @Post()
  @UseInterceptors(FileInterceptor('file'))
  upload(@UploadedFile() file: File) {
    console.log(file)
    return {
      originalname: file.originalname,
      size: file.size,
    }
  }
}
