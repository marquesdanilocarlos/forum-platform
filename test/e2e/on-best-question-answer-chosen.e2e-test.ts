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
import { waitFor } from '../utils/wait-for'
import { DomainEvents } from '@/core/events/domain-events'

describe('Evento de melhor resposta escolhida E2E', () => {
  let app: INestApplication
  let prisma: PrismaService
  let jwt: JwtService
  let studentPrismaFactory: StudentPrismaFactory
  let questionPrismaFactory: QuestionPrismaFactory
  let answerPrismaFactory: AnswerPrismaFactory

  beforeAll(async () => {
    DomainEvents.shouldRun = true
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

  it('Deve enviar uma notificação quando a melhor resposta for escolhida', async () => {
    const user = await studentPrismaFactory.makePrismaStudent({
      name: 'John Doe',
      email: 'john.danilo@meumail.com',
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

    await request(app.getHttpServer())
      .patch(`/answers/${answer.id.value}/choose-as-best`)
      .set('Authorization', `Bearer ${accessToken}`)
      .send()

    await waitFor(async () => {
      const notificationOnDatabase = await prisma.notification.findFirst({
        where: {
          recipientId: user.id.value,
        },
      })

      expect(notificationOnDatabase).toBeTruthy()
    })
  })
})
