type UploadParams = {
  fileName: string
  fileType: string
  fileContent: Buffer
}

export default abstract class Uploader {
  abstract upload(params: UploadParams): Promise<{ url: string }>
}
