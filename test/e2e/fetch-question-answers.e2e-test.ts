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

describe('Listagem respostas de uma pergunta E2E', () => {
  let app: INestApplication
  let jwt: JwtService
  let studentPrismaFactory: StudentPrismaFactory
  let questionPrismaFactory: QuestionPrismaFactory
  let answerPrismaFactory: AnswerPrismaFactory

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule, DatabaseModule],
      providers: [
        StudentPrismaFactory,
        QuestionPrismaFactory,
        AnswerPrismaFactory,
      ],
    }).compile()

    app = moduleRef.createNestApplication()
    jwt = moduleRef.get(JwtService)
    studentPrismaFactory = moduleRef.get(StudentPrismaFactory)
    questionPrismaFactory = moduleRef.get(QuestionPrismaFactory)
    answerPrismaFactory = moduleRef.get(AnswerPrismaFactory)
    await app.init()
  })

  test('Deve listar respostas de uma pergunta', async () => {
    const user = await studentPrismaFactory.makePrismaStudent({
      name: 'John Doe',
      email: 'john.doe234@mailsre.com',
      password: await hash('123456', 8),
    })

    const accessToken = jwt.sign({ sub: user.id.value })

    const question = await questionPrismaFactory.makePrismaQuestion({
      authorId: user.id,
    })

    const [answer01, answer02] = await Promise.all([
      answerPrismaFactory.makePrismaAnswer({
        authorId: user.id,
        questionId: question.id,
        content: 'resposta 1',
      }),
      answerPrismaFactory.makePrismaAnswer({
        authorId: user.id,
        questionId: question.id,
        content: 'resposta 2',
      }),
    ])

    const response = await request(app.getHttpServer())
      .get(`/answers/${question.id.value}`)
      .set('Authorization', `Bearer ${accessToken}`)
      .send()

    expect(response.statusCode).toBe(200)
    expect(response.body.answers).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ content: answer01.content }),
        expect.objectContaining({ content: answer02.content }),
      ]),
    )
  })
})
