import { INestApplication } from '@nestjs/common'
import { Test } from '@nestjs/testing'
import { AppModule } from '@/infra/app.module'
import request from 'supertest'
import { hash } from 'bcryptjs'
import { JwtService } from '@nestjs/jwt'
import StudentPrismaFactory from '../factories/student-prisma-factory'
import QuestionPrismaFactory from '../factories/question-prisma-factory'
import { DatabaseModule } from '@/infra/database/database.module'
import AnswerPrismaFactory from '../factories/answer-prisma-factory'
import AnswerCommentPrismaFactory from '../factories/answer-comment-prisma-factory'

describe('Listagem comentários de uma resposta E2E', () => {
  let app: INestApplication
  let jwt: JwtService
  let studentPrismaFactory: StudentPrismaFactory
  let questionPrismaFactory: QuestionPrismaFactory
  let answerPrismaFactory: AnswerPrismaFactory
  let answerCommentsPrismaFactory: AnswerCommentPrismaFactory

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule, DatabaseModule],
      providers: [
        StudentPrismaFactory,
        QuestionPrismaFactory,
        AnswerPrismaFactory,
        AnswerCommentPrismaFactory,
      ],
    }).compile()

    app = moduleRef.createNestApplication()
    jwt = moduleRef.get(JwtService)
    studentPrismaFactory = moduleRef.get(StudentPrismaFactory)
    questionPrismaFactory = moduleRef.get(QuestionPrismaFactory)
    answerPrismaFactory = moduleRef.get(AnswerPrismaFactory)
    answerCommentsPrismaFactory = moduleRef.get(AnswerCommentPrismaFactory)
    await app.init()
  })

  test('Deve listar comentários de uma resposta', async () => {
    const user = await studentPrismaFactory.makePrismaStudent({
      name: 'John Doe',
      email: 'john.maykao@yahoo.com',
      password: await hash('123456', 8),
    })

    const accessToken = jwt.sign({ sub: user.id.value })

    const question = await questionPrismaFactory.makePrismaQuestion({
      authorId: user.id,
    })

    const answer = await answerPrismaFactory.makePrismaAnswer({
      authorId: user.id,
      questionId: question.id,
    })

    const [comment01, comment02] = await Promise.all([
      answerCommentsPrismaFactory.makePrismaAnswerComment({
        authorId: user.id,
        answerId: answer.id,
        content: 'comentario 1',
      }),
      answerCommentsPrismaFactory.makePrismaAnswerComment({
        authorId: user.id,
        answerId: answer.id,
        content: 'comentario 2',
      }),
    ])

    const response = await request(app.getHttpServer())
      .get(`/answers/${answer.id.value}/comments`)
      .set('Authorization', `Bearer ${accessToken}`)
      .send()

    expect(response.statusCode).toBe(200)
    expect(response.body.answerComments).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ content: comment01.content }),
        expect.objectContaining({ content: comment02.content }),
      ]),
    )
  })
})
