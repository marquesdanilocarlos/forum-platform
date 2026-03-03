import Uploader, {
  UploadParams,
} from '@/domain/forum/application/storage/uploader'
import { randomUUID } from 'node:crypto'

interface Upload {
  fileName: string
  url: string
}

export default class FakeUploader implements Uploader {
  public uploads: Upload[] = []

  async upload({ fileName }: UploadParams): Promise<{ url: string }> {
    this.uploads.push({
      fileName,
      url: randomUUID(),
    })
    return Promise.resolve({ url: '' })
  }
}
