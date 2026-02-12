import InMemoryAnswersRepository from './repositories/in-memory-answers-repository'
import UniqueEntityId from '@/core/entities/unique-entity-id'
import Answer from '@/domain/forum/enterprise/entities/answer'
import makeAnswer from './factories/make-answer'
import EditAnswer from '@/domain/forum/application/use-cases/edit-answer'
import { UnauthorizedError } from '@/core/errors'
import InMemoryAnswerAttachmentsRepository from './repositories/in-memory-answer-attachments-repository'

describe('Edição de resposta', () => {
  let inMemoryAnswersRepository: InMemoryAnswersRepository
  let inMemoryAnswerAttachmentsRepository: InMemoryAnswerAttachmentsRepository
  let sut: EditAnswer

  beforeEach(() => {
    inMemoryAnswersRepository = new InMemoryAnswersRepository()
    inMemoryAnswerAttachmentsRepository =
      new InMemoryAnswerAttachmentsRepository()
    sut = new EditAnswer(
      inMemoryAnswersRepository,
      inMemoryAnswerAttachmentsRepository,
    )
  })

  it('Deve editar uma pergunta pelo id', async () => {
    const newAnswer: Answer = makeAnswer(
      { authorId: new UniqueEntityId('author-sinistro') },
      new UniqueEntityId('to-edit-answer'),
    )

    const answer = await inMemoryAnswersRepository.create(newAnswer)

    await sut.execute({
      authorId: answer.authorId.value,
      answerId: answer.id.value,
      content: 'Novo conteúdo de resposta',
      attachmentsIds: ['1', '3'],
    })

    expect(inMemoryAnswersRepository.answers[0]).toMatchObject({
      content: 'Novo conteúdo de resposta',
    })

    expect(
      inMemoryAnswersRepository.answers[0].attachments.getItems(),
    ).toHaveLength(2)

    expect(inMemoryAnswersRepository.answers[0].attachments.getItems()).toEqual(
      [
        expect.objectContaining({ attachmentId: new UniqueEntityId('1') }),
        expect.objectContaining({ attachmentId: new UniqueEntityId('3') }),
      ],
    )
  })

  it('Não deve editar resposta se o id do autor for diferente', async () => {
    const newAnswer: Answer = makeAnswer(
      { authorId: new UniqueEntityId('autor-sinistro') },
      new UniqueEntityId('to-edit-answer'),
    )
    const answer = await inMemoryAnswersRepository.create(newAnswer)

    expect(async () => {
      await sut.execute({
        authorId: 'outro-autor',
        answerId: answer.id.value,
        content: 'Novo conteúdo de resposta',
        attachmentsIds: [],
      })
    }).rejects.toBeInstanceOf(UnauthorizedError)
  })
})
