import Uploader, {
  UploadParams,
} from '@/domain/forum/application/storage/uploader'
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3'
import EnvService from '@/infra/env/env-service'
import { randomUUID } from 'node:crypto'
import { Injectable } from '@nestjs/common'

@Injectable()
export default class R2Storage implements Uploader {
  private client: S3Client

  constructor(private envService: EnvService) {
    this.client = new S3Client({
      endpoint: `https://${this.envService.get('STORAGE_ACCOUNT_ID')}.r2.cloudflarestorage.com/${this.envService.get('STORAGE_BUCKET_NAME')}`,
      credentials: {
        accessKeyId: String(this.envService.get('STORAGE_ACCESS_KEY_ID')),
        secretAccessKey: String(
          this.envService.get('STORAGE_SECRET_ACCESS_KEY'),
        ),
      },
      region: String(this.envService.get('STORAGE_REGION')),
      forcePathStyle: true,
    })
  }

  async upload({
    fileName,
    fileType,
    fileContent,
  }: UploadParams): Promise<{ url: string }> {
    const uploadId = randomUUID()
    const uniqueFileName = `${uploadId}-${fileName}`

    await this.client.send(
      new PutObjectCommand({
        Bucket: String(this.envService.get('STORAGE_BUCKET_NAME')),
        Key: uniqueFileName,
        ContentType: fileType,
        Body: fileContent,
      }),
    )

    return {
      url: uniqueFileName,
    }
  }
}
