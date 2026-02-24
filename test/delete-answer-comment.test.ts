import InMemoryAnswerCommentsRepository from './repositories/in-memory-answer-comments-repository'
import UniqueEntityId from '@/core/entities/unique-entity-id'
import AnswerComment from '@/domain/forum/enterprise/entities/answer-comment'
import makeAnswerComment from './factories/make-answer-comment'
import DeleteAnswerComment from '@/domain/forum/application/use-cases/delete-answer-comment'
import { UnauthorizedError } from '@/core/errors'

describe('Deleção de comentário da resposta', () => {
  let inMemoryAnswerCommentsRepository: InMemoryAnswerCommentsRepository
  let sut: DeleteAnswerComment

  beforeEach(() => {
    inMemoryAnswerCommentsRepository = new InMemoryAnswerCommentsRepository()
    sut = new DeleteAnswerComment(inMemoryAnswerCommentsRepository)
  })

  it('Deve remover um comentário de uma resposta pelo id', async () => {
    const newAnswerComment: AnswerComment = makeAnswerComment(
      { authorId: new UniqueEntityId('author-sinistro') },
      'to-delete-answer-comment',
    )
    await inMemoryAnswerCommentsRepository.create(newAnswerComment)

    await sut.execute({
      authorId: 'author-sinistro',
      answerCommentId: 'to-delete-answer-comment',
    })
    expect(inMemoryAnswerCommentsRepository.comments).toHaveLength(0)
  })

  it('Não deve deletar comentário da resposta se o id do autor for diferente', async () => {
    const newAnswerComment: AnswerComment = makeAnswerComment(
      { authorId: new UniqueEntityId('author-sinistro') },
      'to-delete-answer-comment',
    )

    await inMemoryAnswerCommentsRepository.create(newAnswerComment)

    expect(async () => {
      await sut.execute({
        authorId: 'outro-autor',
        answerCommentId: 'to-delete-answer-comment',
      })
    }).rejects.toBeInstanceOf(UnauthorizedError)
  })
})
