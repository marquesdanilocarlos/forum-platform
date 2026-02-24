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
import AnswerCommentPrismaFactory from '../factories/answer-comment-prisma-factory'
import AnswerPrismaFactory from '../factories/answer-prisma-factory'

describe('Deleção de comentário das perguntas E2E', () => {
  let app: INestApplication
  let prisma: PrismaService
  let jwt: JwtService
  let studentPrismaFactory: StudentPrismaFactory
  let questionPrismaFactory: QuestionPrismaFactory
  let answerPrismaFactory: AnswerPrismaFactory
  let answerCommentPrismaFactory: AnswerCommentPrismaFactory

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule, DatabaseModule],
      providers: [
        StudentPrismaFactory,
        QuestionPrismaFactory,
        AnswerPrismaFactory,
        AnswerCommentPrismaFactory,
      ],
    }).compile()

    app = moduleRef.createNestApplication()
    prisma = moduleRef.get(PrismaService)
    jwt = moduleRef.get(JwtService)
    studentPrismaFactory = moduleRef.get(StudentPrismaFactory)
    questionPrismaFactory = moduleRef.get(QuestionPrismaFactory)
    answerPrismaFactory = moduleRef.get(AnswerPrismaFactory)
    answerCommentPrismaFactory = moduleRef.get(AnswerCommentPrismaFactory)
    await app.init()
  })

  test('Deve deletar um comentário', async () => {
    const user = await studentPrismaFactory.makePrismaStudent({
      name: 'John Doe',
      email: 'john.doe2454@hotmail.com',
      password: await hash('123456', 8),
    })

    const accessToken = jwt.sign({ sub: user.id.value })

    const question = await questionPrismaFactory.makePrismaQuestion({
      authorId: user.id,
    })

    const answer = await answerPrismaFactory.makePrismaAnswer({
      questionId: question.id,
      authorId: user.id,
      content: 'Resposta marota',
    })

    const comment = await answerCommentPrismaFactory.makePrismaAnswerComment({
      answerId: answer.id,
      authorId: user.id,
      content: 'Comentário maroto',
    })

    const response = await request(app.getHttpServer())
      .delete(`/answers/comments/${comment.id.value}`)
      .set('Authorization', `Bearer ${accessToken}`)
      .send()

    expect(response.statusCode).toBe(204)

    const deletedComment = await prisma.comment.findUnique({
      where: {
        id: comment.id.value,
      },
    })

    expect(deletedComment).toBeNull()
  })
})
