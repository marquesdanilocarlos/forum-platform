import QuestionsRepository from '@/domain/forum/application/repositories/questions-repository'
import Question from '@/domain/forum/enterprise/entities/question'
import UniqueEntityId from '@/core/entities/unique-entity-id'
import QuestionAttachment from '@/domain/forum/enterprise/entities/question-attachment'
import QuestionAttachmentList from '@/domain/forum/enterprise/entities/question-attachment-list'

export type CreateQuestionInput = {
  authorId: string
  title: string
  content: string
  attachmentsIds: string[]
}

type CreateQuestionOutput = {
  question: Question
}

export default class CreateQuestion {
  constructor(private questionsRepository: QuestionsRepository) {}

  async execute(input: CreateQuestionInput): Promise<CreateQuestionOutput> {
    const { authorId, title, content, attachmentsIds } = input

    const question: Question = Question.create({
      authorId: new UniqueEntityId(authorId),
      title,
      content,
    })

    const questionAttachments = attachmentsIds.map((attachmentId) => {
      return QuestionAttachment.create({
        attachmentId: new UniqueEntityId(attachmentId),
        questionId: question.id,
      })
    })

    question.attachments = new QuestionAttachmentList(questionAttachments)
    await this.questionsRepository.create(question)

    return { question }
  }
}
