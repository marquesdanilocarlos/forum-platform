import { INestApplication } from '@nestjs/common'
import { PrismaService } from '@/infra/database/prisma/prisma.service'
import { Test } from '@nestjs/testing'
import { AppModule } from '@/infra/app.module'
import request from 'supertest'
import { hash } from 'bcryptjs'
import { JwtService } from '@nestjs/jwt'
import StudentPrismaFactory from './factories/student-prisma-factory'
import { DatabaseModule } from '@/infra/database/database.module'

describe('Criação de perguntas E2E', () => {
  let app: INestApplication
  let prisma: PrismaService
  let jwt: JwtService
  let studentPrismaFactory: StudentPrismaFactory

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule, DatabaseModule],
      providers: [StudentPrismaFactory],
    }).compile()

    app = moduleRef.createNestApplication()
    prisma = moduleRef.get(PrismaService)
    jwt = moduleRef.get(JwtService)
    studentPrismaFactory = moduleRef.get(StudentPrismaFactory)
    await app.init()
  })

  test('Deve criar uma pergunta', async () => {
    const user = await studentPrismaFactory.makePrismaStudent({
      name: 'John Doe',
      email: 'john.doe3@example.com',
      password: await hash('123456', 8),
    })

    const accessToken = jwt.sign({ sub: user.id.value })

    const response = await request(app.getHttpServer())
      .post('/questions')
      .set('Authorization', `Bearer ${accessToken}`)
      .send({
        title: 'Pergunta de teste',
        content: 'Conteúdo da pergunta de teste',
      })

    expect(response.statusCode).toBe(201)

    const question = await prisma.question.findFirst({
      where: {
        title: 'Pergunta de teste',
      },
    })

    expect(question).toBeTruthy()
  })
})
