import { INestApplication } from '@nestjs/common'
import { PrismaService } from '@/infra/database/prisma/prisma.service'
import { Test } from '@nestjs/testing'
import { AppModule } from '@/infra/app.module'
import request from 'supertest'
import { hash } from 'bcryptjs'
import { JwtService } from '@nestjs/jwt'
import StudentPrismaFactory from './factories/student-prisma-factory'
import QuestionPrismaFactory from './factories/question-prisma-factory'
import { DatabaseModule } from '@/infra/database/database.module'

describe('Listagem de perguntas E2E', () => {
  let app: INestApplication
  let jwt: JwtService
  let studentPrismaFactory: StudentPrismaFactory
  let questionPrismaFactory: QuestionPrismaFactory

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule, DatabaseModule],
      providers: [StudentPrismaFactory, QuestionPrismaFactory],
    }).compile()

    app = moduleRef.createNestApplication()
    jwt = moduleRef.get(JwtService)
    studentPrismaFactory = moduleRef.get(StudentPrismaFactory)
    questionPrismaFactory = moduleRef.get(QuestionPrismaFactory)
    await app.init()
  })

  test('Deve listar perguntas', async () => {
    const user = await studentPrismaFactory.makePrismaStudent({
      name: 'John Doe',
      email: 'john.doe4@example.com',
      password: await hash('123456', 8),
    })

    const accessToken = jwt.sign({ sub: user.id.value })

    const [question01, question02] = await Promise.all([
      questionPrismaFactory.makePrismaQuestion({
        authorId: user.id,
      }),
      questionPrismaFactory.makePrismaQuestion({
        authorId: user.id,
      }),
    ])

    const response = await request(app.getHttpServer())
      .get('/questions')
      .set('Authorization', `Bearer ${accessToken}`)
      .send()

    expect(response.statusCode).toBe(200)
    expect(response.body.questions).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ title: question01.title }),
        expect.objectContaining({ title: question02.title }),
      ]),
    )
  })
})
