import { INestApplication } from '@nestjs/common'
import { PrismaService } from '@/infra/database/prisma/prisma.service'
import { Test } from '@nestjs/testing'
import { AppModule } from '@/infra/app.module'
import request from 'supertest'
import { hash } from 'bcryptjs'
import { JwtService } from '@nestjs/jwt'
import StudentPrismaFactory from '../factories/student-prisma-factory'
import { DatabaseModule } from '@/infra/database/database.module'
import AnswerPrismaFactory from '../factories/answer-prisma-factory'
import QuestionPrismaFactory from '../factories/question-prisma-factory'

describe('Deleção de respostas E2E', () => {
  let app: INestApplication
  let prisma: PrismaService
  let jwt: JwtService
  let studentPrismaFactory: StudentPrismaFactory
  let answerPrismaFactory: AnswerPrismaFactory
  let questionPrismaFactory: QuestionPrismaFactory

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule, DatabaseModule],
      providers: [
        StudentPrismaFactory,
        AnswerPrismaFactory,
        QuestionPrismaFactory,
      ],
    }).compile()

    app = moduleRef.createNestApplication()
    prisma = moduleRef.get(PrismaService)
    jwt = moduleRef.get(JwtService)
    studentPrismaFactory = moduleRef.get(StudentPrismaFactory)
    answerPrismaFactory = moduleRef.get(AnswerPrismaFactory)
    questionPrismaFactory = moduleRef.get(QuestionPrismaFactory)
    await app.init()
  })

  test('Deve deletar uma resposta', async () => {
    const user = await studentPrismaFactory.makePrismaStudent({
      name: 'John Doe',
      email: 'john.doe452@exmailx.com',
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

    const existentAnswer = await prisma.answer.findFirst({
      where: {
        id: answer.id.value,
      },
    })

    expect(existentAnswer).toBeTruthy()

    const response = await request(app.getHttpServer())
      .delete(`/answers/${answer.id.value}`)
      .set('Authorization', `Bearer ${accessToken}`)
      .send()

    expect(response.statusCode).toBe(204)

    const deletedAnswer = await prisma.answer.findFirst({
      where: {
        id: answer.id.value,
      },
    })

    expect(deletedAnswer).toBeNull()
  })
})
