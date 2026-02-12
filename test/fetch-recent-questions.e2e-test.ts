import { INestApplication } from '@nestjs/common'
import { PrismaService } from '@/infra/prisma/prisma.service'
import { Test } from '@nestjs/testing'
import { AppModule } from '@/infra/app.module'
import request from 'supertest'
import { hash } from 'bcryptjs'
import { JwtService } from '@nestjs/jwt'

describe('Listagem de perguntas E2E', () => {
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

  test('Deve listar perguntas', async () => {
    const user = await prisma.user.create({
      data: {
        name: 'John Doe',
        email: 'john.doe4@example.com',
        password: await hash('123456', 8),
      },
    })

    const accessToken = jwt.sign({ sub: user.id })

    await prisma.question.create({
      data: {
        title: 'Question-01',
        slug: 'question-01',
        content: 'conteudo-01',
        authorId: user.id,
      },
    })

    await prisma.question.create({
      data: {
        title: 'Question-02',
        slug: 'question-02',
        content: 'conteudo-02',
        authorId: user.id,
      },
    })

    const response = await request(app.getHttpServer())
      .get('/questions')
      .set('Authorization', `Bearer ${accessToken}`)
      .send()

    expect(response.statusCode).toBe(200)
    expect(response.body.questions).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ title: 'Question-01' }),
        expect.objectContaining({ title: 'Question-02' }),
      ]),
    )
  })
})
