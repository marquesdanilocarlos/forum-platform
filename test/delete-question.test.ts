import InMemoryQuestionsRepository from './repositories/in-memory-questions-repository'
import DeleteQuestion from '@/domain/forum/application/use-cases/delete-question'
import Question from '@/domain/forum/enterprise/entities/question'
import makeQuestion from './factories/make-question'
import UniqueEntityId from '@/core/entities/unique-entity-id'
import { UnauthorizedError } from '@/core/errors'
import makeQuestionAttachment from './factories/make-question-attachments'
import InMemoryQuestionAttachmentsRepository from './repositories/in-memory-question-attachments-repository'

describe('Deleção de pergunta', () => {
  let inMemoryQuestionsRepository: InMemoryQuestionsRepository
  let inMemoryQuestionAttachmentsRepository: InMemoryQuestionAttachmentsRepository
  let sut: DeleteQuestion

  beforeEach(() => {
    inMemoryQuestionsRepository = new InMemoryQuestionsRepository()
    inMemoryQuestionAttachmentsRepository =
      new InMemoryQuestionAttachmentsRepository()
    sut = new DeleteQuestion(
      inMemoryQuestionsRepository,
      inMemoryQuestionAttachmentsRepository,
    )
  })

  it('Deve remover uma pergunta pelo id', async () => {
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
    })

    expect(inMemoryQuestionsRepository.questions).toHaveLength(0)
    expect(inMemoryQuestionAttachmentsRepository.attachments).toHaveLength(0)
  })

  it('Não deve deletar pergunta se o id do autor for diferente', async () => {
    const newQuestion: Question = makeQuestion(
      { authorId: new UniqueEntityId('autor-sinistro') },
      'to-delete-question',
    )
    const question = await inMemoryQuestionsRepository.create(newQuestion)

    expect(async () => {
      await sut.execute({
        authorId: 'outro-autor',
        questionId: question.id.value,
      })
    }).rejects.toBeInstanceOf(UnauthorizedError)
  })
})
