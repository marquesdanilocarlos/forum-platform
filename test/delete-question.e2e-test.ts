import { INestApplication } from '@nestjs/common'
import { PrismaService } from '@/infra/database/prisma/prisma.service'
import { Test } from '@nestjs/testing'
import { AppModule } from '@/infra/app.module'
import request from 'supertest'
import { hash } from 'bcryptjs'
import { JwtService } from '@nestjs/jwt'
import StudentPrismaFactory from './factories/student-prisma-factory'
import { DatabaseModule } from '@/infra/database/database.module'
import QuestionPrismaFactory from './factories/question-prisma-factory'

describe('Deleção de perguntas E2E', () => {
  let app: INestApplication
  let prisma: PrismaService
  let jwt: JwtService
  let studentPrismaFactory: StudentPrismaFactory
  let questionPrismaFactory: QuestionPrismaFactory

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule, DatabaseModule],
      providers: [StudentPrismaFactory, QuestionPrismaFactory],
    }).compile()

    app = moduleRef.createNestApplication()
    prisma = moduleRef.get(PrismaService)
    jwt = moduleRef.get(JwtService)
    studentPrismaFactory = moduleRef.get(StudentPrismaFactory)
    questionPrismaFactory = moduleRef.get(QuestionPrismaFactory)
    await app.init()
  })

  test('Deve deletar uma pergunta', async () => {
    const user = await studentPrismaFactory.makePrismaStudent({
      name: 'John Doe',
      email: 'john.doe984@example.com',
      password: await hash('123456', 8),
    })

    const accessToken = jwt.sign({ sub: user.id.value })

    const question = await questionPrismaFactory.makePrismaQuestion({
      authorId: user.id,
    })

    const existentQuestion = await prisma.question.findFirst({
      where: {
        id: question.id.value,
      },
    })

    expect(existentQuestion).toBeTruthy()

    const response = await request(app.getHttpServer())
      .delete(`/questions/${question.id.value}`)
      .set('Authorization', `Bearer ${accessToken}`)
      .send()

    expect(response.statusCode).toBe(204)

    const deletedQuestion = await prisma.question.findFirst({
      where: {
        id: question.id.value,
      },
    })

    expect(deletedQuestion).toBeNull()
  })
})
