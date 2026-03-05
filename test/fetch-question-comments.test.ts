import UniqueEntityId from '@/core/entities/unique-entity-id'
import InMemoryQuestionCommentsRepository from './repositories/in-memory-question-comments-repository'
import makeQuestionComment from './factories/make-question-comment'
import FetchQuestionComments from '@/domain/forum/application/use-cases/fetch-question-comments'
import InMemoryStudentsRepository from './repositories/in-memory-students-repository'
import makeStudent from './factories/make-student'

describe('Obtenção de comentários de perguntas', () => {
  let inMemoryQuestionCommentsRepository: InMemoryQuestionCommentsRepository
  let inMemoryStudentsRepository: InMemoryStudentsRepository
  let sut: FetchQuestionComments

  beforeEach(() => {
    inMemoryStudentsRepository = new InMemoryStudentsRepository()
    inMemoryQuestionCommentsRepository = new InMemoryQuestionCommentsRepository(
      inMemoryStudentsRepository,
    )
    sut = new FetchQuestionComments(inMemoryQuestionCommentsRepository)
  })

  it('Deve obter comentários de uma pergunta', async () => {
    const student = makeStudent({
      name: 'Juvenal Antena',
    })

    await inMemoryStudentsRepository.create(student)

    const comment1 = makeQuestionComment({
      questionId: new UniqueEntityId('question-marota'),
      authorId: student.id,
    })
    const comment2 = makeQuestionComment({
      questionId: new UniqueEntityId('question-marota'),
      authorId: student.id,
    })
    const comment3 = makeQuestionComment({
      questionId: new UniqueEntityId('question-marota'),
      authorId: student.id,
    })

    await inMemoryQuestionCommentsRepository.create(comment1)
    await inMemoryQuestionCommentsRepository.create(comment2)
    await inMemoryQuestionCommentsRepository.create(comment3)

    const { comments } = await sut.execute({
      questionId: 'question-marota',
      page: 1,
    })

    expect(comments).toHaveLength(3)
    expect(comments).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          authorName: 'Juvenal Antena',
          commentId: comment1.id,
        }),
        expect.objectContaining({
          authorName: 'Juvenal Antena',
          commentId: comment2.id,
        }),
        expect.objectContaining({
          authorName: 'Juvenal Antena',
          commentId: comment3.id,
        }),
      ]),
    )
  })

  it('Deve obter respostas paginadas de uma pergunta', async () => {
    const student = makeStudent({
      name: 'Bruno Mezenga',
    })

    await inMemoryStudentsRepository.create(student)

    for (let i = 1; i <= 22; i++) {
      await inMemoryQuestionCommentsRepository.create(
        makeQuestionComment({
          questionId: new UniqueEntityId('question-sinistra'),
          authorId: student.id,
        }),
      )
    }

    const { comments } = await sut.execute({
      questionId: 'question-sinistra',
      page: 2,
    })

    expect(comments).toHaveLength(2)
  })
})
