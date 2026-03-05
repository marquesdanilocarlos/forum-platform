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
import AnswerAttachmentPrismaFactory from '../factories/answer-attachment-prisma-factory'
import AttachmentPrismaFactory from '../factories/attachment-prisma-factory'

describe('Edição de respostas E2E', () => {
  let app: INestApplication
  let prisma: PrismaService
  let jwt: JwtService
  let studentPrismaFactory: StudentPrismaFactory
  let questionPrismaFactory: QuestionPrismaFactory
  let answerPrismaFactory: AnswerPrismaFactory
  let attachmentPrismaFactory: AttachmentPrismaFactory
  let answerAttachmentPrismaFactory: AnswerAttachmentPrismaFactory

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule, DatabaseModule],
      providers: [
        StudentPrismaFactory,
        AnswerPrismaFactory,
        QuestionPrismaFactory,
        AttachmentPrismaFactory,
        AnswerAttachmentPrismaFactory,
      ],
    }).compile()

    app = moduleRef.createNestApplication()
    prisma = moduleRef.get(PrismaService)
    jwt = moduleRef.get(JwtService)
    studentPrismaFactory = moduleRef.get(StudentPrismaFactory)
    answerPrismaFactory = moduleRef.get(AnswerPrismaFactory)
    questionPrismaFactory = moduleRef.get(QuestionPrismaFactory)
    answerAttachmentPrismaFactory = moduleRef.get(AnswerAttachmentPrismaFactory)
    attachmentPrismaFactory = moduleRef.get(AttachmentPrismaFactory)
    await app.init()
  })

  test('Deve editar uma resposta', async () => {
    const user = await studentPrismaFactory.makePrismaStudent({
      name: 'John Doe',
      email: 'john.doe356@example.com',
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

    const attachment1 = await attachmentPrismaFactory.makePrismaAttachment()
    const attachment2 = await attachmentPrismaFactory.makePrismaAttachment()

    await answerAttachmentPrismaFactory.makePrismaAnswerAttachment({
      attachmentId: attachment1.id,
      answerId: answer.id,
    })

    await answerAttachmentPrismaFactory.makePrismaAnswerAttachment({
      attachmentId: attachment2.id,
      answerId: answer.id,
    })

    const attachment3 = await attachmentPrismaFactory.makePrismaAttachment()

    const response = await request(app.getHttpServer())
      .put(`/answers/${answer.id.value}`)
      .set('Authorization', `Bearer ${accessToken}`)
      .send({
        content: 'Resposta atualizada',
        attachments: [attachment1.id.value, attachment3.id.value],
      })

    expect(response.statusCode).toBe(204)

    const answerOnDatabase = await prisma.answer.findFirst({
      where: {
        content: 'Resposta atualizada',
      },
    })

    expect(answerOnDatabase).toBeTruthy()

    const attachmentsOnDatabase = await prisma.attachment.findMany({
      where: {
        answerId: answer?.id.value,
      },
    })

    expect(attachmentsOnDatabase).toHaveLength(2)
    expect(attachmentsOnDatabase).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          id: attachment1.id.value,
        }),
        expect.objectContaining({
          id: attachment3.id.value,
        }),
      ]),
    )
  })
})
