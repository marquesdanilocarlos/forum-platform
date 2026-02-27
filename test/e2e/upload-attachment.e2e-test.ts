import { Test } from '@nestjs/testing'
import { AppModule } from '@/infra/app.module'
import { DatabaseModule } from '@/infra/database/database.module'
import {
  FastifyAdapter,
  NestFastifyApplication,
} from '@nestjs/platform-fastify'
import multipart from '@fastify/multipart'
import FormData from 'form-data'
import fs from 'node:fs'
import { hash } from 'bcryptjs'
import { JwtService } from '@nestjs/jwt'
import StudentPrismaFactory from '../factories/student-prisma-factory'
import { readFile } from 'node:fs/promises'
import { join } from 'node:path'

describe('Upload attachment E2E', () => {
  let app: NestFastifyApplication
  let jwt: JwtService
  let studentPrismaFactory: StudentPrismaFactory

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule, DatabaseModule],
      providers: [StudentPrismaFactory],
    }).compile()
    app = moduleRef.createNestApplication<NestFastifyApplication>(
      new FastifyAdapter(),
    )
    app = moduleRef.createNestApplication(new FastifyAdapter())
    await app.register(multipart)
    await app.init()

    jwt = moduleRef.get(JwtService)
    studentPrismaFactory = moduleRef.get(StudentPrismaFactory)
  })

  afterAll(async () => {
    await app.close()
  })

  test('Deve fazer upload', async () => {
    const user = await studentPrismaFactory.makePrismaStudent({
      name: 'John Doe',
      email: 'john.doe.upload.slug@gmail.com',
      password: await hash('123456', 8),
    })

    const accessToken = jwt.sign({ sub: user.id.value })

    const form = new FormData()
    form.append(
      'file',
      await readFile(join(process.cwd(), 'test/e2e/danilo.jpg')),
      {
        contentType: 'application/json',
        filename: 'danilo.jpg',
      },
    )

    const res = await app
      .getHttpAdapter()
      .getInstance()
      .inject({
        method: 'POST',
        url: '/attachments',
        headers: {
          ...form.getHeaders(),
          Authorization: `Bearer ${accessToken}`,
        },
        payload: form,
      })

    expect(res.statusCode).toBe(201)
  })
})
