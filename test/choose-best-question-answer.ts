import InMemoryQuestionsRepository from './repositories/in-memory-questions-repository'
import InMemoryAnswersRepository from './repositories/in-memory-answers-repository'
import makeQuestion from './factories/make-question'
import makeAnswer from './factories/make-answer'
import ChooseBestQuestionAnswer from '@/domain/forum/application/use-cases/choose-best-question-answer'
import UniqueEntityId from '@/core/entities/unique-entity-id'
import { UnauthorizedError } from '@/core/errors'

describe('Seleção de melhor resposta para uma pergunta', () => {
  let inMemoryQuestionsRepository: InMemoryQuestionsRepository
  let inMemoryAnswersRepository: InMemoryAnswersRepository
  let sut: ChooseBestQuestionAnswer

  beforeEach(async () => {
    inMemoryQuestionsRepository = new InMemoryQuestionsRepository()
    inMemoryAnswersRepository = new InMemoryAnswersRepository()
    sut = new ChooseBestQuestionAnswer(
      inMemoryQuestionsRepository,
      inMemoryAnswersRepository,
    )
  })

  it('Deve ser possível selecionar uma resposta como a melhor para uma pergunta', async () => {
    const newQuestion = await inMemoryQuestionsRepository.create(makeQuestion())
    const newAnswer = await inMemoryAnswersRepository.create(
      makeAnswer({ questionId: newQuestion.id }),
    )

    await sut.execute({
      answerId: newAnswer.id.value,
      authorId: newQuestion.authorId.value,
    })

    expect(inMemoryQuestionsRepository.questions[0].bestAnswerId).toEqual(
      newAnswer.id,
    )
  })

  it('Não deve ser possível selecionar uma resposta como a melhor para uma pergunta com autor diferente', async () => {
    const newQuestion = await inMemoryQuestionsRepository.create(
      makeQuestion({ authorId: new UniqueEntityId('autor-cabuloso') }),
    )
    const newAnswer = await inMemoryAnswersRepository.create(
      makeAnswer({ questionId: newQuestion.id }),
    )

    expect(async () => {
      await sut.execute({
        answerId: newAnswer.id.value,
        authorId: 'autor-nao-cabuloso',
      })
    }).rejects.toBeInstanceOf(UnauthorizedError)
  })
})
