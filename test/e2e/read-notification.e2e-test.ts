import { INestApplication } from '@nestjs/common'
import { Test } from '@nestjs/testing'
import { AppModule } from '@/infra/app.module'
import request from 'supertest'
import { hash } from 'bcryptjs'
import { JwtService } from '@nestjs/jwt'
import { DatabaseModule } from '@/infra/database/database.module'
import StudentPrismaFactory from '../factories/student-prisma-factory'
import QuestionPrismaFactory from '../factories/question-prisma-factory'
import AttachmentPrismaFactory from '../factories/attachment-prisma-factory'
import QuestionAttachmentPrismaFactory from '../factories/question-attachment-prisma-factory'
import NotificationPrismaFactory from '../factories/notification-prisma-factory'
import { PrismaService } from '@/infra/database/prisma/prisma.service'

describe('Leitura de notificações E2E', () => {
  let app: INestApplication
  let jwt: JwtService
  let studentPrismaFactory: StudentPrismaFactory
  let notificationPrismaFactory: NotificationPrismaFactory
  let prisma: PrismaService

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule, DatabaseModule],
      providers: [
        StudentPrismaFactory,
        QuestionPrismaFactory,
        AttachmentPrismaFactory,
        StudentPrismaFactory,
        QuestionAttachmentPrismaFactory,
        NotificationPrismaFactory,
        PrismaService,
      ],
    }).compile()

    app = moduleRef.createNestApplication()
    jwt = moduleRef.get(JwtService)
    studentPrismaFactory = moduleRef.get(StudentPrismaFactory)
    notificationPrismaFactory = moduleRef.get(NotificationPrismaFactory)
    prisma = moduleRef.get(PrismaService)

    await app.init()
  })

  test('Deve ler uma notificação', async () => {
    const user = await studentPrismaFactory.makePrismaStudent({
      name: 'Leozin',
      email: 'john.leozin.pergunta.slug@example.com',
      password: await hash('123456', 8),
    })

    const accessToken = jwt.sign({ sub: user.id.value })

    const notification = await notificationPrismaFactory.makePrismaNotification(
      {
        recipientId: user.id,
      },
    )

    const response = await request(app.getHttpServer())
      .patch(`/notifications/${notification.id.value}/read`)
      .set('Authorization', `Bearer ${accessToken}`)
      .send()

    expect(response.statusCode).toBe(204)

    const notificationOnDatabase = await prisma.notification.findFirst({
      where: {
        recipientId: user.id.value,
      },
    })

    expect(notificationOnDatabase?.readAt).not.toBeNull()
  })
})
