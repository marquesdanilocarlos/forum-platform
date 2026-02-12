import { INestApplication } from '@nestjs/common'
import { PrismaService } from '@/infra/prisma/prisma.service'
import { Test } from '@nestjs/testing'
import { AppModule } from '@/infra/app.module'
import request from 'supertest'
import { hash } from 'bcryptjs'
import { JwtService } from '@nestjs/jwt'

describe('Criação de perguntas E2E', () => {
  let app: INestApplication
  let prisma: PrismaService
  let jwt: JwtService

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule],
    }).compile()

    app = moduleRef.createNestApplication()
    prisma = moduleRef.get(PrismaService)
    jwt = moduleRef.get(JwtService)
    await app.init()
  })

  test('Deve criar uma pergunta', async () => {
    const user = await prisma.user.create({
      data: {
        name: 'John Doe',
        email: 'john.doe3@example.com',
        password: await hash('123456', 8),
      },
    })

    const accessToken = jwt.sign({ sub: user.id })

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
