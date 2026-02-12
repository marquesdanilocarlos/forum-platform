import InMemoryQuestionsRepository from './repositories/in-memory-questions-repository'
import makeQuestion from './factories/make-question'
import FetchRecentQuestions from '@/domain/forum/application/use-cases/fetch-recent-questions'

describe('Obtenção de perguntas recentes', () => {
  let inMemoryQuestionsRepository: InMemoryQuestionsRepository
  let sut: FetchRecentQuestions

  beforeEach(() => {
    inMemoryQuestionsRepository = new InMemoryQuestionsRepository()
    sut = new FetchRecentQuestions(inMemoryQuestionsRepository)
  })

  it('Deve obter perguntas recentes', async () => {
    await inMemoryQuestionsRepository.create(
      makeQuestion({
        createdAt: new Date(2026, 0, 20),
      }),
    )

    await inMemoryQuestionsRepository.create(
      makeQuestion({
        createdAt: new Date(2026, 0, 30),
      }),
    )

    await inMemoryQuestionsRepository.create(
      makeQuestion({
        createdAt: new Date(2026, 0, 10),
      }),
    )

    const { questions } = await sut.execute({ page: 1 })

    expect(questions).toEqual([
      expect.objectContaining({ createdAt: new Date(2026, 0, 30) }),
      expect.objectContaining({ createdAt: new Date(2026, 0, 20) }),
      expect.objectContaining({ createdAt: new Date(2026, 0, 10) }),
    ])
  })

  it('Deve obter perguntas recentes paginadas', async () => {
    for (let i = 1; i <= 22; i++) {
      await inMemoryQuestionsRepository.create(makeQuestion())
    }

    const { questions } = await sut.execute({ page: 2 })

    expect(questions).toHaveLength(2)
  })
})
