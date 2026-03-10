import { INestApplication } from '@nestjs/common'
import { Test } from '@nestjs/testing'
import { AppModule } from '@/infra/app.module'
import { DatabaseModule } from '@/infra/database/database.module'
import StudentPrismaFactory from '../factories/student-prisma-factory'
import QuestionPrismaFactory from '../factories/question-prisma-factory'
import AttachmentPrismaFactory from '../factories/attachment-prisma-factory'
import QuestionAttachmentPrismaFactory from '../factories/question-attachment-prisma-factory'
import CacheProvider from '@/infra/cache/CacheProvider'
import { CacheModule } from '@/infra/cache/cache.module'
import QuestionsRepository from '@/domain/forum/application/repositories/questions-repository'

describe('Listagem de perguntas E2E', () => {
  let app: INestApplication

  let questionPrismaFactory: QuestionPrismaFactory
  let attachmentPrismaFactory: AttachmentPrismaFactory
  let studentPrismaFactory: StudentPrismaFactory
  let questionAttachmentPrismaFactory: QuestionAttachmentPrismaFactory
  let cacheProvider: CacheProvider
  let questionsRepository: QuestionsRepository

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule, DatabaseModule, CacheModule],
      providers: [
        StudentPrismaFactory,
        QuestionPrismaFactory,
        AttachmentPrismaFactory,
        StudentPrismaFactory,
        QuestionAttachmentPrismaFactory,
      ],
    }).compile()

    app = moduleRef.createNestApplication()
    studentPrismaFactory = moduleRef.get(StudentPrismaFactory)
    questionPrismaFactory = moduleRef.get(QuestionPrismaFactory)
    attachmentPrismaFactory = moduleRef.get(AttachmentPrismaFactory)
    studentPrismaFactory = moduleRef.get(StudentPrismaFactory)
    questionAttachmentPrismaFactory = moduleRef.get(
      QuestionAttachmentPrismaFactory,
    )
    cacheProvider = moduleRef.get(CacheProvider)
    questionsRepository = moduleRef.get(QuestionsRepository)

    await app.init()
  })

  it('Deve buscar pergunta pelo slug e salvar no cache', async () => {
    const user = await studentPrismaFactory.makePrismaStudent({})

    const question = await questionPrismaFactory.makePrismaQuestion({
      authorId: user.id,
    })

    const slug = question.slug
    const questionDetails = await questionsRepository.findDetailsBySlug(slug)

    const cached =
      (await cacheProvider.get(`questions:${slug.value}:details`)) ?? '{}'

    expect(JSON.parse(cached)).toEqual(
      expect.objectContaining({
        id: questionDetails?.questionId.value,
      }),
    )
  })

  it('Deve buscar pergunta pelo slug através do cache', async () => {
    const user = await studentPrismaFactory.makePrismaStudent({})

    const question = await questionPrismaFactory.makePrismaQuestion({
      authorId: user.id,
    })

    const slug = question.slug

    let cached = await cacheProvider.get(`questions:${slug.value}:details`)

    expect(cached).toBeNull()

    await questionsRepository.findDetailsBySlug(slug)

    cached =
      (await cacheProvider.get(`questions:${slug.value}:details`)) ?? '{}'

    expect(cached).not.toBeNull()

    const questionDetails = await questionsRepository.findDetailsBySlug(slug)

    expect(JSON.parse(cached)).toEqual(
      expect.objectContaining({
        id: questionDetails?.questionId.value,
      }),
    )
  })

  it('Deve resetar os detalhes da pergunta que vem do cache quando salvar', async () => {
    const user = await studentPrismaFactory.makePrismaStudent({})

    const question = await questionPrismaFactory.makePrismaQuestion({
      authorId: user.id,
    })

    const slug = question.slug

    await cacheProvider.set(
      `questions:${slug}:details`,
      JSON.stringify({ empty: true }),
    )

    await questionsRepository.save(question)

    const cached = await cacheProvider.get(`questions:${slug.value}:details`)

    expect(cached).toBeNull()
  })
})
