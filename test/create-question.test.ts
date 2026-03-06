import CreateQuestion, {
  CreateQuestionInput,
} from '@/domain/forum/application/use-cases/create-question'
import InMemoryQuestionsRepository from './repositories/in-memory-questions-repository'
import UniqueEntityId from '@/core/entities/unique-entity-id'
import InMemoryQuestionAttachmentsRepository from './repositories/in-memory-question-attachments-repository'
import InMemoryAttachmentsRepository from './repositories/in-memory-attachments-repository'
import InMemoryStudentsRepository from './repositories/in-memory-students-repository'

describe('Teste de criação de pergunta', () => {
  let inMemoryQuestionsRepository: InMemoryQuestionsRepository
  let inMemoryQuestionAttachmentsRepository: InMemoryQuestionAttachmentsRepository
  let inMemoryAttachmentsRepository: InMemoryAttachmentsRepository
  let inMemoryStudentsRepository: InMemoryStudentsRepository
  let sut: CreateQuestion

  beforeEach(async () => {
    inMemoryQuestionAttachmentsRepository =
      new InMemoryQuestionAttachmentsRepository()
    inMemoryAttachmentsRepository = new InMemoryAttachmentsRepository()
    inMemoryStudentsRepository = new InMemoryStudentsRepository()
    inMemoryQuestionsRepository = new InMemoryQuestionsRepository(
      inMemoryQuestionAttachmentsRepository,
      inMemoryAttachmentsRepository,
      inMemoryStudentsRepository,
    )
    sut = new CreateQuestion(inMemoryQuestionsRepository)
  })

  it('Deve criar uma nova pergunta', async () => {
    const newQuestionData: CreateQuestionInput = {
      authorId: '1',
      title: 'Nova Pergunta',
      content: 'Como funciona isso',
      attachmentsIds: ['1', '2'],
    }
    const { question } = await sut.execute(newQuestionData)
    expect(question.id).toBeTruthy()
    expect(inMemoryQuestionsRepository.questions[0].id).toEqual(question.id)
    expect(
      inMemoryQuestionsRepository.questions[0].attachments.getItems(),
    ).toHaveLength(2)
    expect(
      inMemoryQuestionsRepository.questions[0].attachments.getItems(),
    ).toEqual([
      expect.objectContaining({ attachmentId: new UniqueEntityId('1') }),
      expect.objectContaining({ attachmentId: new UniqueEntityId('2') }),
    ])
  })

  it('Deve persistir os anexos ao criar uma nova pergunta', async () => {
    const newQuestionData: CreateQuestionInput = {
      authorId: '1',
      title: 'Nova Pergunta',
      content: 'Como funciona isso',
      attachmentsIds: ['1', '2'],
    }
    const { question } = await sut.execute(newQuestionData)
    expect(question.id).toBeTruthy()
    expect(inMemoryQuestionAttachmentsRepository.attachments).toHaveLength(2)
    expect(inMemoryQuestionAttachmentsRepository.attachments).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          attachmentId: new UniqueEntityId('1'),
        }),
        expect.objectContaining({
          attachmentId: new UniqueEntityId('2'),
        }),
      ]),
    )
  })
})
