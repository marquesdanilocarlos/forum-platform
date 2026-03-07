import QuestionDetails from '@/domain/forum/enterprise/entities/value-objects/question-details'
import { AttachmentPresenter } from '@/infra/http/presenter/attachment-presenter'

export class QuestionDetailsPresenter {
  static toHttp(questionDetails: QuestionDetails) {
    return {
      questionId: questionDetails.questionId.value,
      authorId: questionDetails.authorId.value,
      authorName: questionDetails.authorName,
      title: questionDetails.title,
      slug: questionDetails.slug.value,
      bestAnswerId: questionDetails.bestAnswerId?.value,
      createdAt: questionDetails.createdAt,
      updatedAt: questionDetails.updatedAt,
      attachments: questionDetails.attachments.map(AttachmentPresenter.toHttp),
    }
  }
}
