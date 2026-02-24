import InMemoryAnswersRepository from './repositories/in-memory-answers-repository'
import DeleteAnswer from '@/domain/forum/application/use-cases/delete-answer'
import UniqueEntityId from '@/core/entities/unique-entity-id'
import Answer from '@/domain/forum/enterprise/entities/answer'
import makeAnswer from './factories/make-answer'
import { UnauthorizedError } from '@/core/errors'
import InMemoryAnswerAttachmentsRepository from './repositories/in-memory-answer-attachments-repository'
import makeAnswerAttachment from './factories/make-answer-attachments'

describe('Deleção de resposta', () => {
  let inMemoryAnswersRepository: InMemoryAnswersRepository
  let inMemoryAnswerAttachmentsRepository: InMemoryAnswerAttachmentsRepository
  let sut: DeleteAnswer

  beforeEach(() => {
    inMemoryAnswersRepository = new InMemoryAnswersRepository()
    inMemoryAnswerAttachmentsRepository =
      new InMemoryAnswerAttachmentsRepository()
    sut = new DeleteAnswer(
      inMemoryAnswersRepository,
      inMemoryAnswerAttachmentsRepository,
    )
  })

  it('Deve remover uma pergunta pelo id', async () => {
    const newAnswer: Answer = makeAnswer(
      { authorId: new UniqueEntityId('author-sinistro') },
      new UniqueEntityId('to-delete-answer'),
    )
    await inMemoryAnswersRepository.create(newAnswer)

    inMemoryAnswerAttachmentsRepository.attachments.push(
      makeAnswerAttachment({
        answerId: new UniqueEntityId('to-delete-answer'),
        attachmentId: new UniqueEntityId('1'),
      }),
    )

    inMemoryAnswerAttachmentsRepository.attachments.push(
      makeAnswerAttachment({
        answerId: new UniqueEntityId('to-delete-answer'),
        attachmentId: new UniqueEntityId('2'),
      }),
    )

    await sut.execute({
      authorId: 'author-sinistro',
      answerId: 'to-delete-answer',
    })

    expect(inMemoryAnswersRepository.answers).toHaveLength(0)
    expect(inMemoryAnswerAttachmentsRepository.attachments).toHaveLength(0)
  })

  it('Não deve deletar resposta se o id do autor for diferente', async () => {
    const newAnswer: Answer = makeAnswer(
      { authorId: new UniqueEntityId('autor-sinistro') },
      new UniqueEntityId('to-delete-answer'),
    )
    await inMemoryAnswersRepository.create(newAnswer)

    expect(async () => {
      await sut.execute({
        authorId: 'outro-autor',
        answerId: 'to-delete-answer',
      })
    }).rejects.toBeInstanceOf(UnauthorizedError)
  })
})
