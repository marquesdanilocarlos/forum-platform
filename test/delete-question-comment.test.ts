import InMemoryQuestionCommentsRepository from './repositories/in-memory-question-comments-repository'
import UniqueEntityId from '@/core/entities/unique-entity-id'
import QuestionComment from '@/domain/forum/enterprise/entities/question-comment'
import makeQuestionComment from './factories/make-question-comment'
import DeleteQuestionComment from '@/domain/forum/application/use-cases/delete-question-comment'
import { UnauthorizedError } from '@/core/errors'

describe('Deleção de comentário da pergunta', () => {
  let inMemoryQuestionCommentsRepository: InMemoryQuestionCommentsRepository
  let sut: DeleteQuestionComment

  beforeEach(() => {
    inMemoryQuestionCommentsRepository =
      new InMemoryQuestionCommentsRepository()
    sut = new DeleteQuestionComment(inMemoryQuestionCommentsRepository)
  })

  it('Deve remover um comentário de uma pergunta pelo id', async () => {
    const newQuestionComment: QuestionComment = makeQuestionComment(
      { authorId: new UniqueEntityId('author-sinistro') },
      'to-delete-question-comment',
    )
    await inMemoryQuestionCommentsRepository.create(newQuestionComment)

    await sut.execute({
      authorId: 'author-sinistro',
      questionCommentId: 'to-delete-question-comment',
    })
    expect(inMemoryQuestionCommentsRepository.comments).toHaveLength(0)
  })

  it('Não deve deletar pergunta se o id do autor for diferente', async () => {
    const newQuestionComment: QuestionComment = makeQuestionComment(
      { authorId: new UniqueEntityId('author-sinistro') },
      'to-delete-question-comment',
    )

    await inMemoryQuestionCommentsRepository.create(newQuestionComment)

    expect(async () => {
      await sut.execute({
        authorId: 'outro-autor',
        questionCommentId: 'to-delete-question-comment',
      })
    }).rejects.toBeInstanceOf(UnauthorizedError)
  })
})
