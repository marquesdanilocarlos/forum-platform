import makeQuestion from './factories/make-question'
import Question from '@/domain/forum/enterprise/entities/question'
import InMemoryQuestionsRepository from './repositories/in-memory-questions-repository'
import InMemoryQuestionCommentsRepository from './repositories/in-memory-question-comments-repository'
import InMemoryQuestionAttachmentsRepository from './repositories/in-memory-question-attachments-repository'
import InMemoryAttachmentsRepository from './repositories/in-memory-attachments-repository'
import InMemoryStudentsRepository from './repositories/in-memory-students-repository'
import CommentOnQuestion from '@/domain/forum/application/use-cases/comment-on-question'

describe('Comentários de perguntas', () => {
  let inMemoryQuestionCommentsRepository: InMemoryQuestionCommentsRepository
  let inMemoryQuestionsRepository: InMemoryQuestionsRepository
  let inMemoryQuestionAttachmentsRepository: InMemoryQuestionAttachmentsRepository
  let inMemoryAttachmentsRepository: InMemoryAttachmentsRepository
  let inMemoryStudentsRepository: InMemoryStudentsRepository
  let sut: CommentOnQuestion

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
    inMemoryQuestionCommentsRepository = new InMemoryQuestionCommentsRepository(
      inMemoryStudentsRepository,
    )
    sut = new CommentOnQuestion(
      inMemoryQuestionsRepository,
      inMemoryQuestionCommentsRepository,
    )
  })

  it('Deve comentar numa pergunta', async () => {
    const newQuestion: Question = makeQuestion()
    await inMemoryQuestionsRepository.create(newQuestion)

    await sut.execute({
      questionId: newQuestion.id.value,
      authorId: newQuestion.authorId.value,
      content: 'Comentário Maroto',
    })

    expect(inMemoryQuestionCommentsRepository.comments[0].content).toEqual(
      'Comentário Maroto',
    )
  })
})
