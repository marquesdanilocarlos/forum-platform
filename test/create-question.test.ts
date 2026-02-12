import CreateQuestion, {
  CreateQuestionInput,
} from '@/domain/forum/application/use-cases/create-question'
import InMemoryQuestionsRepository from './repositories/in-memory-questions-repository'
import UniqueEntityId from '@/core/entities/unique-entity-id'

describe('Teste de criação de pergunta', () => {
  let inMemoryQuestionsRepository: InMemoryQuestionsRepository
  let sut: CreateQuestion

  beforeEach(async () => {
    inMemoryQuestionsRepository = new InMemoryQuestionsRepository()
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
})
