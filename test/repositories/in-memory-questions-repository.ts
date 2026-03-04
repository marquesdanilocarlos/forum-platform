import QuestionsRepository from '@/domain/forum/application/repositories/questions-repository'
import Question from '@/domain/forum/enterprise/entities/question'
import Slug from '@/domain/forum/enterprise/entities/value-objects/slug'
import PaginationParams from '@/core/types/pagination-params'
import { DomainEvents } from '@/core/events/domain-events'
import QuestionAttachmentsRepository from '@/domain/forum/application/repositories/question-attachments-repository'

export default class InMemoryQuestionsRepository implements QuestionsRepository {
  public questions: Question[] = []

  constructor(
    private questionAttachmentsRepository: QuestionAttachmentsRepository,
  ) {}

  async findById(id: string): Promise<Question | null> {
    const question =
      this.questions.find((question) => question.id.value === id) ?? null
    return Promise.resolve(question)
  }

  async delete(question: Question): Promise<void> {
    const questionIndex = this.questions.findIndex(
      (item) => item.id.value === question.id.value,
    )

    this.questions.splice(questionIndex, 1)
    return Promise.resolve()
  }

  async create(question: Question): Promise<Question> {
    this.questions.push(question)

    await this.questionAttachmentsRepository.createMany(
      question.attachments.getItems(),
    )

    DomainEvents.dispatchEventsForAggregate(question.id)
    return Promise.resolve(question)
  }

  findBySlug(slug: Slug): Promise<Question | null> {
    const question =
      this.questions.find((question) => question.slug.value === slug.value) ??
      null
    return Promise.resolve(question)
  }

  async save(question: Question): Promise<Question> {
    const questionIndex = this.questions.findIndex(
      (item) => item.id.value === question.id.value,
    )

    this.questions[questionIndex] = question

    await this.questionAttachmentsRepository.createMany(
      question.attachments.getNewItems(),
    )

    await this.questionAttachmentsRepository.deleteMany(
      question.attachments.getRemovedItems(),
    )

    DomainEvents.dispatchEventsForAggregate(question.id)
    return Promise.resolve(this.questions[questionIndex])
  }

  async findManyRecent({ page }: PaginationParams): Promise<Question[]> {
    const questions = this.questions
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
      .slice((page - 1) * 20, page * 20)
    return Promise.resolve(questions)
  }
}
