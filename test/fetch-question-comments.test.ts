import UniqueEntityId from '@/core/entities/unique-entity-id'
import InMemoryQuestionCommentsRepository from './repositories/in-memory-question-comments-repository'
import makeQuestionComment from './factories/make-question-comment'
import FetchQuestionComments from '@/domain/forum/application/use-cases/fetch-question-comments'

describe('Obtenção de comentários de perguntas', () => {
  let inMemoryQuestionCommentsRepository: InMemoryQuestionCommentsRepository
  let sut: FetchQuestionComments

  beforeEach(() => {
    inMemoryQuestionCommentsRepository =
      new InMemoryQuestionCommentsRepository()
    sut = new FetchQuestionComments(inMemoryQuestionCommentsRepository)
  })

  it('Deve obter comentários de uma pergunta', async () => {
    await inMemoryQuestionCommentsRepository.create(
      makeQuestionComment({
        questionId: new UniqueEntityId('question-marota'),
      }),
    )

    await inMemoryQuestionCommentsRepository.create(
      makeQuestionComment({
        questionId: new UniqueEntityId('question-marota'),
      }),
    )

    await inMemoryQuestionCommentsRepository.create(
      makeQuestionComment({
        questionId: new UniqueEntityId('question-marota'),
      }),
    )

    const { questionComments } = await sut.execute({
      questionId: 'question-marota',
      page: 1,
    })

    expect(questionComments).toHaveLength(3)
  })

  it('Deve obter respostas paginadas de uma pergunta', async () => {
    for (let i = 1; i <= 22; i++) {
      await inMemoryQuestionCommentsRepository.create(
        makeQuestionComment({
          questionId: new UniqueEntityId('question-sinistra'),
        }),
      )
    }

    const { questionComments } = await sut.execute({
      questionId: 'question-sinistra',
      page: 2,
    })

    expect(questionComments).toHaveLength(2)
  })
})
