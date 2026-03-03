import Uploader, {
  UploadParams,
} from '@/domain/forum/application/storage/uploader'
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3'
import EnvService from '@/infra/env/env-service'
import { randomUUID } from 'node:crypto'
import { Injectable } from '@nestjs/common'

@Injectable()
export default class TebiStorage implements Uploader {
  private client: S3Client
  private endpoint: string = 'https://s3.tebi.io'
  private region: string = 'global'

  constructor(private envService: EnvService) {
    this.client = new S3Client([
      {
        endpoint: this.endpoint,
        region: this.region,
        credentials: {
          accessKeyId: this.envService.get('STORAGE_PUBLIC_KEY'),
          secretAccessKey: this.envService.get('STORAGE_SECRET_KEY'),
        },
      },
    ])
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
