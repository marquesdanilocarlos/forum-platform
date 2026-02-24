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
import QuestionCommentPrismaFactory from '../factories/question-comment-prisma-factory'

describe('Listagem comentários de uma pergunta E2E', () => {
  let app: INestApplication
  let jwt: JwtService
  let studentPrismaFactory: StudentPrismaFactory
  let questionPrismaFactory: QuestionPrismaFactory
  let questionCommentsPrismaFactory: QuestionCommentPrismaFactory

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule, DatabaseModule],
      providers: [
        StudentPrismaFactory,
        QuestionPrismaFactory,
        QuestionCommentPrismaFactory,
      ],
    }).compile()

    app = moduleRef.createNestApplication()
    jwt = moduleRef.get(JwtService)
    studentPrismaFactory = moduleRef.get(StudentPrismaFactory)
    questionPrismaFactory = moduleRef.get(QuestionPrismaFactory)
    questionCommentsPrismaFactory = moduleRef.get(QuestionCommentPrismaFactory)
    await app.init()
  })

  test('Deve listar comentários de uma pergunta', async () => {
    const user = await studentPrismaFactory.makePrismaStudent({
      name: 'John Doe',
      email: 'john.diego@live.com',
      password: await hash('123456', 8),
    })

    const accessToken = jwt.sign({ sub: user.id.value })

    const question = await questionPrismaFactory.makePrismaQuestion({
      authorId: user.id,
    })

    const [comment01, comment02] = await Promise.all([
      questionCommentsPrismaFactory.makePrismaQuestionComment({
        authorId: user.id,
        questionId: question.id,
        content: 'comentario 1',
      }),
      questionCommentsPrismaFactory.makePrismaQuestionComment({
        authorId: user.id,
        questionId: question.id,
        content: 'comentario 2',
      }),
    ])

    const response = await request(app.getHttpServer())
      .get(`/questions/${question.id.value}/comments`)
      .set('Authorization', `Bearer ${accessToken}`)
      .send()

    expect(response.statusCode).toBe(200)
    expect(response.body.questionComments).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ content: comment01.content }),
        expect.objectContaining({ content: comment02.content }),
      ]),
    )
  })
})
