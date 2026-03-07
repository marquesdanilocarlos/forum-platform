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

describe('Listagem de perguntas E2E', () => {
  let app: INestApplication
  let jwt: JwtService
  let questionPrismaFactory: QuestionPrismaFactory
  let attachmentPrismaFactory: AttachmentPrismaFactory
  let studentPrismaFactory: StudentPrismaFactory
  let questionAttachmentPrismaFactory: QuestionAttachmentPrismaFactory

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule, DatabaseModule],
      providers: [
        StudentPrismaFactory,
        QuestionPrismaFactory,
        AttachmentPrismaFactory,
        StudentPrismaFactory,
        QuestionAttachmentPrismaFactory,
      ],
    }).compile()

    app = moduleRef.createNestApplication()
    jwt = moduleRef.get(JwtService)
    studentPrismaFactory = moduleRef.get(StudentPrismaFactory)
    questionPrismaFactory = moduleRef.get(QuestionPrismaFactory)
    attachmentPrismaFactory = moduleRef.get(AttachmentPrismaFactory)
    studentPrismaFactory = moduleRef.get(StudentPrismaFactory)
    questionAttachmentPrismaFactory = moduleRef.get(
      QuestionAttachmentPrismaFactory,
    )

    await app.init()
  })

  test('Deve buscar pergunta pelo slug', async () => {
    const user = await studentPrismaFactory.makePrismaStudent({
      name: 'Leozin',
      email: 'john.leozin.pergunta.slug@example.com',
      password: await hash('123456', 8),
    })

    const accessToken = jwt.sign({ sub: user.id.value })

    const question = await questionPrismaFactory.makePrismaQuestion({
      authorId: user.id,
    })

    const attachment = await attachmentPrismaFactory.makePrismaAttachment()

    await questionAttachmentPrismaFactory.makePrismaQuestionAttachment({
      questionId: question.id,
      attachmentId: attachment.id,
    })

    const response = await request(app.getHttpServer())
      .get(`/questions/${question.slug.value}`)
      .set('Authorization', `Bearer ${accessToken}`)
      .send()

    expect(response.statusCode).toBe(200)
    expect(response.body.question).toEqual(
      expect.objectContaining({
        title: question.title,
        authorName: 'Leozin',
        attachments: [
          expect.objectContaining({
            title: attachment.title,
          }),
        ],
      }),
    )
  })
})
