import InMemoryAttachmentsRepository from './repositories/in-memory-attachments-repository'
import UploadAndCreateAttachment from '@/domain/forum/application/use-cases/upload-and-create-attachment'
import FakeUploader from './storage/fake-uploader'
import InvalidAttachmentTypeError from '@/domain/forum/application/use-cases/errors/invalid-attachment-type.error'

describe('Teste de upload de anexos', () => {
  let inMemoryAttachmentsRepository: InMemoryAttachmentsRepository
  let fakeUploader: FakeUploader
  let sut: UploadAndCreateAttachment

  beforeEach(async () => {
    inMemoryAttachmentsRepository = new InMemoryAttachmentsRepository()
    fakeUploader = new FakeUploader()
    sut = new UploadAndCreateAttachment(
      inMemoryAttachmentsRepository,
      fakeUploader,
    )
  })

  it('Deve realizar o upload de anexos', async () => {
    const { attachment } = await sut.execute({
      fileName: 'profile.png',
      fileType: 'image/png',
      fileContent: Buffer.from(''),
    })

    expect(attachment).toEqual(inMemoryAttachmentsRepository.attachments[0])
    expect(fakeUploader.uploads[0]).toEqual(
      expect.objectContaining({
        fileName: 'profile.png',
      }),
    )
  })

  it('Não deve realizar upload de anexo com tipo de arquivo inválido', async () => {
    expect(
      async () =>
        await sut.execute({
          fileName: 'audio.mp3',
          fileType: 'audio/mpeg',
          fileContent: Buffer.from(''),
        }),
    ).rejects.toThrowError(InvalidAttachmentTypeError)
  })
})
