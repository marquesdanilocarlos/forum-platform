import InMemoryAnswersRepository from './repositories/in-memory-answers-repository'
import UniqueEntityId from '@/core/entities/unique-entity-id'
import EditAnswer from '@/domain/forum/application/use-cases/edit-answer'
import { UnauthorizedError } from '@/core/errors'
import InMemoryAnswerAttachmentsRepository from './repositories/in-memory-answer-attachments-repository'
import Answer from '@/domain/forum/enterprise/entities/answer'
import makeAnswer from './factories/make-answer'
import makeAnswerAttachment from './factories/make-answer-attachments'

describe('Edição de resposta', () => {
  let inMemoryAnswersRepository: InMemoryAnswersRepository
  let inMemoryAnswerAttachmentsRepository: InMemoryAnswerAttachmentsRepository
  let sut: EditAnswer

  beforeEach(() => {
    inMemoryAnswerAttachmentsRepository =
      new InMemoryAnswerAttachmentsRepository()
    inMemoryAnswersRepository = new InMemoryAnswersRepository(
      inMemoryAnswerAttachmentsRepository,
    )
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

    await inMemoryAnswersRepository.create(newAnswer)

    await sut.execute({
      authorId: 'author-sinistro',
      answerId: 'to-edit-answer',
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

    await inMemoryAnswersRepository.create(newAnswer)

    expect(async () => {
      await sut.execute({
        authorId: 'outro-autor',
        answerId: 'to-edit-answer',
        content: 'Novo conteúdo de resposta',
        attachmentsIds: [],
      })
    }).rejects.toBeInstanceOf(UnauthorizedError)
  })

  it('Deve sincronizar anexos novos e removidos ao editar uma resposta', async () => {
    const newAnswer: Answer = makeAnswer(
      { authorId: new UniqueEntityId('author-sinistro') },
      new UniqueEntityId('to-delete-answer'),
    )
    await inMemoryAnswersRepository.create(newAnswer)

    inMemoryAnswerAttachmentsRepository.attachments.push(
      makeAnswerAttachment({
        answerId: newAnswer.id,
        attachmentId: new UniqueEntityId('1'),
      }),
    )

    inMemoryAnswerAttachmentsRepository.attachments.push(
      makeAnswerAttachment({
        answerId: newAnswer.id,
        attachmentId: new UniqueEntityId('2'),
      }),
    )

    const result = await sut.execute({
      authorId: newAnswer.authorId.value,
      answerId: newAnswer.id.value,
      content: 'Novo Conteúdo',
      attachmentsIds: ['1', '3'],
    })

    expect(result.answer.id).toBeTruthy()
    expect(inMemoryAnswerAttachmentsRepository.attachments).toHaveLength(2)
    expect(inMemoryAnswerAttachmentsRepository.attachments).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          attachmentId: new UniqueEntityId('1'),
        }),
        expect.objectContaining({
          attachmentId: new UniqueEntityId('3'),
        }),
      ]),
    )
  })
})
