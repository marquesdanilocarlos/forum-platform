import InMemoryQuestionsRepository from './repositories/in-memory-questions-repository'
import EditQuestion from '@/domain/forum/application/use-cases/edit-question'
import Question from '@/domain/forum/enterprise/entities/question'
import makeQuestion from './factories/make-question'
import UniqueEntityId from '@/core/entities/unique-entity-id'
import { UnauthorizedError } from '@/core/errors'
import InMemoryQuestionAttachmentsRepository from './repositories/in-memory-question-attachments-repository'
import makeQuestionAttachment from './factories/make-question-attachments'
import InMemoryAttachmentsRepository from './repositories/in-memory-attachments-repository'
import InMemoryStudentsRepository from './repositories/in-memory-students-repository'

describe('Edição de pergunta', () => {
  let inMemoryQuestionsRepository: InMemoryQuestionsRepository
  let inMemoryQuestionAttachmentsRepository: InMemoryQuestionAttachmentsRepository
  let inMemoryAttachmentsRepository: InMemoryAttachmentsRepository
  let inMemoryStudentsRepository: InMemoryStudentsRepository
  let sut: EditQuestion

  beforeEach(() => {
    inMemoryQuestionAttachmentsRepository =
      new InMemoryQuestionAttachmentsRepository()
    inMemoryAttachmentsRepository = new InMemoryAttachmentsRepository()
    inMemoryStudentsRepository = new InMemoryStudentsRepository()
    inMemoryQuestionsRepository = new InMemoryQuestionsRepository(
      inMemoryQuestionAttachmentsRepository,
      inMemoryAttachmentsRepository,
      inMemoryStudentsRepository,
    )
    sut = new EditQuestion(
      inMemoryQuestionsRepository,
      inMemoryQuestionAttachmentsRepository,
    )
  })

  it('Deve editar uma pergunta pelo id', async () => {
    const newQuestion: Question = makeQuestion(
      { authorId: new UniqueEntityId('author-sinistro') },
      'to-delete-question',
    )
    const question = await inMemoryQuestionsRepository.create(newQuestion)

    inMemoryQuestionAttachmentsRepository.attachments.push(
      makeQuestionAttachment({
        questionId: question.id,
        attachmentId: new UniqueEntityId('1'),
      }),
    )

    inMemoryQuestionAttachmentsRepository.attachments.push(
      makeQuestionAttachment({
        questionId: question.id,
        attachmentId: new UniqueEntityId('2'),
      }),
    )

    await sut.execute({
      authorId: question.authorId.value,
      questionId: question.id.value,
      title: 'Novo título',
      content: 'Novo Conteúdo',
      attachmentsIds: ['1', '3'],
    })

    expect(inMemoryQuestionsRepository.questions[0]).toMatchObject({
      title: 'Novo título',
      content: 'Novo Conteúdo',
    })
    expect(
      inMemoryQuestionsRepository.questions[0].attachments.getItems(),
    ).toHaveLength(2)
    expect(
      inMemoryQuestionsRepository.questions[0].attachments.getItems(),
    ).toEqual([
      expect.objectContaining({ attachmentId: new UniqueEntityId('1') }),
      expect.objectContaining({ attachmentId: new UniqueEntityId('3') }),
    ])
  })

  it('Não deve editar pergunta se o id do autor for diferente', async () => {
    const newQuestion: Question = makeQuestion(
      { authorId: new UniqueEntityId('autor-sinistro') },
      'to-delete-question',
    )
    const question = await inMemoryQuestionsRepository.create(newQuestion)

    expect(async () => {
      await sut.execute({
        authorId: 'outro-autor',
        questionId: question.id.value,
        title: 'Novo título',
        content: 'Novo Conteúdo',
        attachmentsIds: [],
      })
    }).rejects.toBeInstanceOf(UnauthorizedError)
  })

  it('Deve sincronizar anexos novos e removidos ao editar uma pergunta', async () => {
    const newQuestion: Question = makeQuestion(
      { authorId: new UniqueEntityId('author-sinistro') },
      'to-delete-question',
    )
    const question = await inMemoryQuestionsRepository.create(newQuestion)

    inMemoryQuestionAttachmentsRepository.attachments.push(
      makeQuestionAttachment({
        questionId: question.id,
        attachmentId: new UniqueEntityId('1'),
      }),
    )

    inMemoryQuestionAttachmentsRepository.attachments.push(
      makeQuestionAttachment({
        questionId: question.id,
        attachmentId: new UniqueEntityId('2'),
      }),
    )

    const result = await sut.execute({
      authorId: question.authorId.value,
      questionId: question.id.value,
      title: 'Novo título',
      content: 'Novo Conteúdo',
      attachmentsIds: ['1', '3'],
    })

    expect(result.question.id).toBeTruthy()
    expect(inMemoryQuestionAttachmentsRepository.attachments).toHaveLength(2)
    expect(inMemoryQuestionAttachmentsRepository.attachments).toEqual(
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
