import Answer from '@/domain/forum/enterprise/entities/answer'
import AnswersRepository from '@/domain/forum/application/repositories/answers-repository'
import UniqueEntityId from '@/core/entities/unique-entity-id'
import AnswerAttachmentList from '@/domain/forum/enterprise/entities/answer-attachment-list'
import AnswerAttachment from '@/domain/forum/enterprise/entities/answer-attachment'

type QuestionAnswerInput = {
  instructorId: string
  questionId: string
  content: string
  attachmentsIds: string[]
}

type QuestionAnswerOutput = {
  answer: Answer
}

export default class QuestionAnswer {
  constructor(private answersRepository: AnswersRepository) {}

  async execute(input: QuestionAnswerInput): Promise<QuestionAnswerOutput> {
    const { instructorId, questionId, content, attachmentsIds } = input

    const answer: Answer = Answer.create({
      authorId: new UniqueEntityId(instructorId),
      questionId: new UniqueEntityId(questionId),
      content,
    })

    const answerAttachments = attachmentsIds.map((attachmentId) => {
      return AnswerAttachment.create({
        attachmentId: new UniqueEntityId(attachmentId),
        answerId: answer.id,
      })
    })

    answer.attachments = new AnswerAttachmentList(answerAttachments)

    await this.answersRepository.create(answer)

    return {
      answer,
    }
  }
}
