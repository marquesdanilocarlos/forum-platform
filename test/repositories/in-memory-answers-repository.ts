import AnswersRepository from '@/domain/forum/application/repositories/answers-repository'
import Answer from '@/domain/forum/enterprise/entities/answer'
import PaginationParams from '@/core/types/pagination-params'
import { DomainEvents } from '@/core/events/domain-events'

export default class InMemoryAnswersRepository implements AnswersRepository {
  public answers: Answer[] = []
  async findById(id: string): Promise<Answer | null> {
    const answer =
      this.answers.find((question) => question.id.value === id) ?? null
    return Promise.resolve(answer)
  }

  async create(answer: Answer): Promise<Answer> {
    this.answers.push(answer)
    DomainEvents.dispatchEventsForAggregate(answer.id)
    return Promise.resolve(answer)
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

  async save(answer: Answer): Promise<Answer> {
    const answerIndex = this.answers.findIndex(
      (item) => item.id.value === answer.id.value,
    )

    this.answers[answerIndex] = answer
    DomainEvents.dispatchEventsForAggregate(answer.id)
    return Promise.resolve(this.answers[answerIndex])
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
