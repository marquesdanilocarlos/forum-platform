import UniqueEntityId from '@/core/entities/unique-entity-id'
import InMemoryAnswerCommentsRepository from './repositories/in-memory-answer-comments-repository'
import makeAnswerComment from './factories/make-answer-comment'
import FetchAnswerComments from '@/domain/forum/application/use-cases/fetch-answer-comments'

describe('Obtenção de comentários de perguntas', () => {
  let inMemoryAnswerCommentsRepository: InMemoryAnswerCommentsRepository
  let sut: FetchAnswerComments

  beforeEach(() => {
    inMemoryAnswerCommentsRepository = new InMemoryAnswerCommentsRepository()
    sut = new FetchAnswerComments(inMemoryAnswerCommentsRepository)
  })

  it('Deve obter comentários de uma pergunta', async () => {
    await inMemoryAnswerCommentsRepository.create(
      makeAnswerComment({
        answerId: new UniqueEntityId('answer-marota'),
      }),
    )

    await inMemoryAnswerCommentsRepository.create(
      makeAnswerComment({
        answerId: new UniqueEntityId('answer-marota'),
      }),
    )

    await inMemoryAnswerCommentsRepository.create(
      makeAnswerComment({
        answerId: new UniqueEntityId('answer-marota'),
      }),
    )

    const { answerComments } = await sut.execute({
      answerId: 'answer-marota',
      page: 1,
    })

    expect(answerComments).toHaveLength(3)
  })

  it('Deve obter respostas paginadas de uma pergunta', async () => {
    for (let i = 1; i <= 22; i++) {
      await inMemoryAnswerCommentsRepository.create(
        makeAnswerComment({
          answerId: new UniqueEntityId('answer-sinistra'),
        }),
      )
    }

    const { answerComments } = await sut.execute({
      answerId: 'answer-sinistra',
      page: 2,
    })

    expect(answerComments).toHaveLength(2)
  })
})
