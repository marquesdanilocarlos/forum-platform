import UniqueEntityId from '@/core/entities/unique-entity-id'
import InMemoryAnswerCommentsRepository from './repositories/in-memory-answer-comments-repository'
import makeAnswerComment from './factories/make-answer-comment'
import FetchAnswerComments from '@/domain/forum/application/use-cases/fetch-answer-comments'
import InMemoryStudentsRepository from './repositories/in-memory-students-repository'
import makeStudent from './factories/make-student'

describe('Obtenção de comentários de perguntas', () => {
  let inMemoryAnswerCommentsRepository: InMemoryAnswerCommentsRepository
  let inMemoryStudentsRepository: InMemoryStudentsRepository
  let sut: FetchAnswerComments

  beforeEach(() => {
    inMemoryStudentsRepository = new InMemoryStudentsRepository()
    inMemoryAnswerCommentsRepository = new InMemoryAnswerCommentsRepository(
      inMemoryStudentsRepository,
    )
    sut = new FetchAnswerComments(inMemoryAnswerCommentsRepository)
  })

  it('Deve obter comentários de uma pergunta', async () => {
    const student = makeStudent({
      name: 'Juvenal Antena',
    })

    await inMemoryStudentsRepository.create(student)

    const comment1 = makeAnswerComment({
      answerId: new UniqueEntityId('answer-marota'),
      authorId: student.id,
    })
    const comment2 = makeAnswerComment({
      answerId: new UniqueEntityId('answer-marota'),
      authorId: student.id,
    })
    const comment3 = makeAnswerComment({
      answerId: new UniqueEntityId('answer-marota'),
      authorId: student.id,
    })

    await inMemoryAnswerCommentsRepository.create(comment1)
    await inMemoryAnswerCommentsRepository.create(comment2)
    await inMemoryAnswerCommentsRepository.create(comment3)

    const { comments } = await sut.execute({
      answerId: 'answer-marota',
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
      await inMemoryAnswerCommentsRepository.create(
        makeAnswerComment({
          answerId: new UniqueEntityId('answer-sinistra'),
          authorId: student.id,
        }),
      )
    }

    const { comments } = await sut.execute({
      answerId: 'answer-sinistra',
      page: 2,
    })

    expect(comments).toHaveLength(2)
  })
})
