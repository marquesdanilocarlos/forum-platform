import Answer from '@/domain/forum/enterprise/entities/answer'

export class AnswerPresenter {
  static toHttp(answer: Answer) {
    return {
      id: answer.id.value,
      content: answer.content,
      createdAt: answer.createdAt,
      updatedAt: answer.updatedAt,
    }
  }
}
