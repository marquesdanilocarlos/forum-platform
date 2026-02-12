import makeQuestion from './factories/make-question'
import Question from '@/domain/forum/enterprise/entities/question'
import InMemoryQuestionsRepository from './repositories/in-memory-questions-repository'
import InMemoryQuestionCommentsRepository from './repositories/in-memory-question-comments-repository'
import CommentOnQuestion from '@/domain/forum/application/use-cases/comment-on-question'

describe('Comentários de perguntas', () => {
  let inMemoryQuestionCommentsRepository: InMemoryQuestionCommentsRepository
  let inMemoryQuestionsRepository: InMemoryQuestionsRepository
  let sut: CommentOnQuestion

  beforeEach(() => {
    inMemoryQuestionCommentsRepository =
      new InMemoryQuestionCommentsRepository()
    inMemoryQuestionsRepository = new InMemoryQuestionsRepository()
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
