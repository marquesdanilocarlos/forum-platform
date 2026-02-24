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

describe('Comentários sobre pergunta E2E', () => {
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

  test('Deve comentar numa pergunta', async () => {
    const user = await studentPrismaFactory.makePrismaStudent({
      name: 'John Doe',
      email: 'john.doe568@johnmail.com',
      password: await hash('123456', 8),
    })

    const accessToken = jwt.sign({ sub: user.id.value })

    const question = await questionPrismaFactory.makePrismaQuestion({
      authorId: user.id,
    })

    const response = await request(app.getHttpServer())
      .post(`/questions/${question.id.value}/comments`)
      .set('Authorization', `Bearer ${accessToken}`)
      .send({
        content: 'Novo comentário numa pergunta',
      })

    expect(response.statusCode).toBe(201)

    const commentOnDatabase = await prisma.comment.findFirst({
      where: {
        content: 'Novo comentário numa pergunta',
      },
    })

    expect(commentOnDatabase).toBeTruthy()
  })
})
