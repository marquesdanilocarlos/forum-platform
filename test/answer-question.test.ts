import AnswerQuestion from '@/domain/forum/application/use-cases/answer-question'
import InMemoryAnswersRepository from './repositories/in-memory-answers-repository'
import InMemoryAnswerAttachmentsRepository from './repositories/in-memory-answer-attachments-repository'
import UniqueEntityId from '@/core/entities/unique-entity-id'

describe('Criacão de respostas', () => {
  let inMemoryAnswersRepository: InMemoryAnswersRepository
  let inMemoryAnswerAttachmentsRepository: InMemoryAnswerAttachmentsRepository
  let sut: AnswerQuestion

  beforeEach(() => {
    inMemoryAnswerAttachmentsRepository =
      new InMemoryAnswerAttachmentsRepository()
    inMemoryAnswersRepository = new InMemoryAnswersRepository(
      inMemoryAnswerAttachmentsRepository,
    )
    sut = new AnswerQuestion(inMemoryAnswersRepository)
  })

  test('Deve responder uma pergunta', async () => {
    const questionAnswerData = {
      authorId: 'instrctor-1',
      questionId: 'question-1',
      content: 'Deve ser feito assim',
      createdAt: new Date(),
      attachmentsIds: ['1', '2'],
    }

    const { answer } = await sut.execute(questionAnswerData)
    expect(answer.id).toBeTruthy()
    expect(inMemoryAnswersRepository.answers[0].id).toEqual(answer.id)
    expect(
      inMemoryAnswersRepository.answers[0].attachments.getItems(),
    ).toHaveLength(2)
    expect(inMemoryAnswersRepository.answers[0].attachments.getItems()).toEqual(
      [
        expect.objectContaining({ attachmentId: new UniqueEntityId('1') }),
        expect.objectContaining({ attachmentId: new UniqueEntityId('2') }),
      ],
    )
  })
})
