import AnswersRepository from '@/domain/forum/application/repositories/answers-repository'
import Answer from '@/domain/forum/enterprise/entities/answer'
import PaginationParams from '@/core/types/pagination-params'
import { DomainEvents } from '@/core/events/domain-events'
import AnswerAttachmentsRepository from '@/domain/forum/application/repositories/answer-attachments-repository'

export default class InMemoryAnswersRepository extends AnswersRepository {
  public answers: Answer[] = []

  constructor(
    private answerAttachmentsRepository: AnswerAttachmentsRepository,
  ) {
    super()
  }

  async findById(id: string): Promise<Answer | null> {
    const answer = this.answers.find((answer) => answer.id.value === id) ?? null
    return Promise.resolve(answer)
  }

  async create(answer: Answer): Promise<void> {
    this.answers.push(answer)

    await this.answerAttachmentsRepository.createMany(
      answer.attachments.getItems(),
    )

    DomainEvents.dispatchEventsForAggregate(answer.id)
  }

  async delete(answer: Answer): Promise<void> {
    const answerIndex = this.answers.findIndex(
      (item) => item.id.value === answer.id.value,
    )

    if (answerIndex === -1) {
      return
    }

    this.answers.splice(answerIndex, 1)
    return Promise.resolve()
  }

  async save(answer: Answer): Promise<void> {
    const answerIndex = this.answers.findIndex(
      (item) => item.id.value === answer.id.value,
    )

    await this.answerAttachmentsRepository.createMany(
      answer.attachments.getNewItems(),
    )

    await this.answerAttachmentsRepository.deleteMany(
      answer.attachments.getRemovedItems(),
    )

    this.answers[answerIndex] = answer
    DomainEvents.dispatchEventsForAggregate(answer.id)
  }

  findManyByQuestionId(
    questionId: string,
    { page }: PaginationParams,
  ): Promise<Answer[]> {
    const answers = this.answers
      .filter((answer) => answer.questionId.value === questionId)
      .slice((page - 1) * 20, page * 20)

    return Promise.resolve(answers)
  }
}
