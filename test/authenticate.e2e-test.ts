import request from 'supertest'
import { Test } from '@nestjs/testing'
import { INestApplication } from '@nestjs/common'
import { AppModule } from '@/app.module'
import { PrismaService } from '@/prisma/prisma.service'
import { hash } from 'bcryptjs'

describe('Autenticação (E2E)', () => {
  let app: INestApplication
  let prisma: PrismaService

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule],
    }).compile()

    app = moduleRef.createNestApplication()
    prisma = moduleRef.get(PrismaService)
    await app.init()
  })

  test('Deve autenticar', async () => {
    await prisma.user.create({
      data: {
        name: 'John Doe',
        email: 'john.doe9@example.com',
        password: await hash('123456', 8),
      },
    })

    const response = await request(app.getHttpServer())
      .post('/authenticate')
      .send({
        email: 'john.doe9@example.com',
        password: '123456',
      })
    expect(response.statusCode).toBe(200)
    expect(response.body).toHaveProperty('access_token')
  })
})
