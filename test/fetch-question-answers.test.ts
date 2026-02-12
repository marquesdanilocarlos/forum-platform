import makeAnswer from './factories/make-answer'
import InMemoryAnswersRepository from './repositories/in-memory-answers-repository'
import FetchQuestionAnswers from '@/domain/forum/application/use-cases/fetch-question-answers'
import UniqueEntityId from '@/core/entities/unique-entity-id'

describe('Obtenção de perguntas recentes', () => {
  let inMemoryAnswersRepository: InMemoryAnswersRepository
  let sut: FetchQuestionAnswers

  beforeEach(() => {
    inMemoryAnswersRepository = new InMemoryAnswersRepository()
    sut = new FetchQuestionAnswers(inMemoryAnswersRepository)
  })

  it('Deve obter respostas de uma pergunta', async () => {
    await inMemoryAnswersRepository.create(
      makeAnswer({
        questionId: new UniqueEntityId('question-marota'),
      }),
    )

    await inMemoryAnswersRepository.create(
      makeAnswer({
        questionId: new UniqueEntityId('question-marota'),
      }),
    )

    await inMemoryAnswersRepository.create(
      makeAnswer({
        questionId: new UniqueEntityId('question-marota'),
      }),
    )

    const { answers } = await sut.execute({
      questionId: 'question-marota',
      page: 1,
    })

    expect(answers).toHaveLength(3)
  })

  it('Deve obter respostas paginadas de uma pergunta', async () => {
    for (let i = 1; i <= 22; i++) {
      await inMemoryAnswersRepository.create(
        makeAnswer({
          questionId: new UniqueEntityId('question-sinistra'),
        }),
      )
    }

    const { answers } = await sut.execute({
      questionId: 'question-sinistra',
      page: 2,
    })

    expect(answers).toHaveLength(2)
  })
})
