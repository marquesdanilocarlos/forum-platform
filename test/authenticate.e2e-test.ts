import request from 'supertest'
import { Test } from '@nestjs/testing'
import { INestApplication } from '@nestjs/common'
import { AppModule } from '@/infra/app.module'
import { hash } from 'bcryptjs'
import StudentPrismaFactory from './factories/student-prisma-factory'
import { DatabaseModule } from '@/infra/database/database.module'

describe('Autenticação (E2E)', () => {
  let app: INestApplication
  let studentPrismaFactory: StudentPrismaFactory

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule, DatabaseModule],
      providers: [StudentPrismaFactory],
    }).compile()

    app = moduleRef.createNestApplication()
    studentPrismaFactory = moduleRef.get(StudentPrismaFactory)
    await app.init()
  })

  test('Deve autenticar', async () => {
    await studentPrismaFactory.makePrismaStudent({
      name: 'John Doe',
      email: 'john.doe9@example.com',
      password: await hash('123456', 8),
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
