import { INestApplication } from '@nestjs/common'
import { PrismaService } from '@/infra/database/prisma/prisma.service'
import { Test } from '@nestjs/testing'
import { AppModule } from '@/infra/app.module'
import request from 'supertest'
import { hash } from 'bcryptjs'
import { JwtService } from '@nestjs/jwt'
import StudentPrismaFactory from '../factories/student-prisma-factory'
import { DatabaseModule } from '@/infra/database/database.module'
import QuestionPrismaFactory from '../factories/question-prisma-factory'
import AttachmentPrismaFactory from '../factories/attachment-prisma-factory'
import QuestionAttachmentPrismaFactory from '../factories/question-attachment-prisma-factory'

describe('Edição de perguntas E2E', () => {
  let app: INestApplication
  let prisma: PrismaService
  let jwt: JwtService
  let studentPrismaFactory: StudentPrismaFactory
  let questionPrismaFactory: QuestionPrismaFactory
  let attachmentPrismaFactory: AttachmentPrismaFactory
  let questionAttachmentPrismaFactory: QuestionAttachmentPrismaFactory

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule, DatabaseModule],
      providers: [
        StudentPrismaFactory,
        QuestionPrismaFactory,
        AttachmentPrismaFactory,
        QuestionAttachmentPrismaFactory,
      ],
    }).compile()

    app = moduleRef.createNestApplication()
    prisma = moduleRef.get(PrismaService)
    jwt = moduleRef.get(JwtService)
    studentPrismaFactory = moduleRef.get(StudentPrismaFactory)
    questionPrismaFactory = moduleRef.get(QuestionPrismaFactory)
    attachmentPrismaFactory = moduleRef.get(AttachmentPrismaFactory)
    questionAttachmentPrismaFactory = moduleRef.get(
      QuestionAttachmentPrismaFactory,
    )
    await app.init()
  })

  test('Deve editar uma pergunta', async () => {
    const user = await studentPrismaFactory.makePrismaStudent({
      name: 'John Doe',
      email: 'john.doe132@example.com',
      password: await hash('123456', 8),
    })

    const accessToken = jwt.sign({ sub: user.id.value })

    const question = await questionPrismaFactory.makePrismaQuestion({
      authorId: user.id,
    })

    const attachment1 = await attachmentPrismaFactory.makePrismaAttachment()
    const attachment2 = await attachmentPrismaFactory.makePrismaAttachment()

    await questionAttachmentPrismaFactory.makePrismaQuestionAttachment({
      attachmentId: attachment1.id,
      questionId: question.id,
    })

    await questionAttachmentPrismaFactory.makePrismaQuestionAttachment({
      attachmentId: attachment2.id,
      questionId: question.id,
    })

    const attachment3 = await attachmentPrismaFactory.makePrismaAttachment()

    const response = await request(app.getHttpServer())
      .put(`/questions/${question.id.value}`)
      .set('Authorization', `Bearer ${accessToken}`)
      .send({
        title: 'Pergunta atualizada',
        content: 'Conteúdo da pergunta atualizado',
        attachments: [attachment1.id.value, attachment3.id.value],
      })

    expect(response.statusCode).toBe(204)

    const updatedQuestion = await prisma.question.findFirst({
      where: {
        title: 'Pergunta atualizada',
      },
    })

    expect(updatedQuestion).toBeTruthy()
    const attachmentsOnDatabase = await prisma.attachment.findMany({
      where: {
        questionId: question?.id.value,
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
