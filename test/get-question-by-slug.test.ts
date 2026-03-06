import InMemoryQuestionsRepository from './repositories/in-memory-questions-repository'
import InMemoryQuestionAttachmentsRepository from './repositories/in-memory-question-attachments-repository'
import GetQuestionBySlug from '@/domain/forum/application/use-cases/get-question-by-slug'
import Question from '@/domain/forum/enterprise/entities/question'
import makeQuestion from './factories/make-question'
import InMemoryAttachmentsRepository from './repositories/in-memory-attachments-repository'
import InMemoryStudentsRepository from './repositories/in-memory-students-repository'
import makeStudent from './factories/make-student'
import makeAttachment from './factories/make-attachment'
import makeQuestionAttachment from './factories/make-question-attachments'

describe('Consulta de pergunta', () => {
  let inMemoryQuestionsRepository: InMemoryQuestionsRepository
  let inMemoryQuestionAttachmentsRepository: InMemoryQuestionAttachmentsRepository
  let inMemoryAttachmentsRepository: InMemoryAttachmentsRepository
  let inMemoryStudentsRepository: InMemoryStudentsRepository
  let sut: GetQuestionBySlug

  beforeEach(() => {
    inMemoryAttachmentsRepository = new InMemoryAttachmentsRepository()
    inMemoryStudentsRepository = new InMemoryStudentsRepository()
    inMemoryQuestionAttachmentsRepository =
      new InMemoryQuestionAttachmentsRepository()
    inMemoryQuestionsRepository = new InMemoryQuestionsRepository(
      inMemoryQuestionAttachmentsRepository,
      inMemoryAttachmentsRepository,
      inMemoryStudentsRepository,
    )
    sut = new GetQuestionBySlug(inMemoryQuestionsRepository)
  })

  it('Deve obter uma pergunta pelo slug', async () => {
    const student = makeStudent({ name: 'João Doido' })
    await inMemoryStudentsRepository.create(student)

    const newQuestion: Question = makeQuestion({
      authorId: student.id,
    })
    await inMemoryQuestionsRepository.create(newQuestion)

    const attachment = makeAttachment({
      title: 'Attachment monstro',
    })
    await inMemoryAttachmentsRepository.create(attachment)

    await inMemoryQuestionAttachmentsRepository.createMany([
      makeQuestionAttachment({
        attachmentId: attachment.id,
        questionId: newQuestion.id,
      }),
    ])

    const { question } = await sut.execute({ slug: newQuestion.slug.value })
    expect(question.questionId).toBeTruthy()
    expect(question).toMatchObject({
      title: newQuestion.title,
      authorName: 'João Doido',
      attachments: [
        expect.objectContaining({
          title: 'Attachment monstro',
        }),
      ],
    })
  })
})
