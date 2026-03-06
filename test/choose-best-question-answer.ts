import InMemoryQuestionsRepository from './repositories/in-memory-questions-repository'
import InMemoryQuestionAttachmentsRepository from './repositories/in-memory-question-attachments-repository'
import InMemoryAnswersRepository from './repositories/in-memory-answers-repository'
import InMemoryAnswerAttachmentsRepository from './repositories/in-memory-answer-attachments-repository'
import makeQuestion from './factories/make-question'
import makeAnswer from './factories/make-answer'
import ChooseBestQuestionAnswer from '@/domain/forum/application/use-cases/choose-best-question-answer'
import UniqueEntityId from '@/core/entities/unique-entity-id'
import { UnauthorizedError } from '@/core/errors'
import InMemoryAttachmentsRepository from './repositories/in-memory-attachments-repository'
import InMemoryStudentsRepository from './repositories/in-memory-students-repository'

describe('Seleção de melhor resposta para uma pergunta', () => {
  let inMemoryQuestionsRepository: InMemoryQuestionsRepository
  let inMemoryQuestionAttachmentsRepository: InMemoryQuestionAttachmentsRepository
  let inMemoryAnswersRepository: InMemoryAnswersRepository
  let inMemoryAnswerAttachmentsRepository: InMemoryAnswerAttachmentsRepository
  let inMemoryAttachmentsRepository: InMemoryAttachmentsRepository
  let inMemoryStudentsRepository: InMemoryStudentsRepository
  let sut: ChooseBestQuestionAnswer

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
    inMemoryAnswerAttachmentsRepository =
      new InMemoryAnswerAttachmentsRepository()
    inMemoryAnswersRepository = new InMemoryAnswersRepository(
      inMemoryAnswerAttachmentsRepository,
    )
    sut = new ChooseBestQuestionAnswer(
      inMemoryQuestionsRepository,
      inMemoryAnswersRepository,
    )
  })

  it('Deve ser possível selecionar uma resposta como a melhor para uma pergunta', async () => {
    const newQuestion = await inMemoryQuestionsRepository.create(makeQuestion())
    await inMemoryAnswersRepository.create(
      makeAnswer(
        { questionId: newQuestion.id },
        new UniqueEntityId('new-answer-id'),
      ),
    )

    await sut.execute({
      answerId: 'new-answer-id',
      authorId: newQuestion.authorId.value,
    })

    expect(inMemoryQuestionsRepository.questions[0].bestAnswerId).toEqual(
      new UniqueEntityId('new-answer-id'),
    )
  })

  it('Não deve ser possível selecionar uma resposta como a melhor para uma pergunta com autor diferente', async () => {
    const newQuestion = await inMemoryQuestionsRepository.create(
      makeQuestion({ authorId: new UniqueEntityId('autor-cabuloso') }),
    )
    await inMemoryAnswersRepository.create(
      makeAnswer({ questionId: newQuestion.id }),
    )

    expect(async () => {
      await sut.execute({
        answerId: 'new-answer-id',
        authorId: 'autor-nao-cabuloso',
      })
    }).rejects.toBeInstanceOf(UnauthorizedError)
  })
})
