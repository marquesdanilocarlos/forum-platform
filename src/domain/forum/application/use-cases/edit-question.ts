import QuestionsRepository from '@/domain/forum/application/repositories/questions-repository'
import Question from '@/domain/forum/enterprise/entities/question'
import { NotFoundError, UnauthorizedError } from '@/core/errors'
import QuestionAttachmentsRepository from '@/domain/forum/application/repositories/question-attachments-repository'
import QuestionAttachmentList from '@/domain/forum/enterprise/entities/question-attachment-list'
import QuestionAttachment from '@/domain/forum/enterprise/entities/question-attachment'
import UniqueEntityId from '@/core/entities/unique-entity-id'

type EditQuestionInput = {
  authorId: string
  questionId: string
  title: string
  content: string
  attachmentsIds: string[]
}

type EditQuestionOutput = {
  question: Question
}

export default class EditQuestion {
  constructor(
    private questionsRepository: QuestionsRepository,
    private questionAttachmentsRepository: QuestionAttachmentsRepository,
  ) {}

  async execute(input: EditQuestionInput): Promise<EditQuestionOutput> {
    const { authorId, questionId, title, content, attachmentsIds } = input
    const question = await this.questionsRepository.findById(questionId)

    if (!question) {
      throw new NotFoundError(
        `A pergunta com o id: ${questionId} não foi encontrada`,
      )
    }

    if (authorId !== question.authorId.value) {
      throw new UnauthorizedError(
        'Não é permitido editar a pergunta de um usuário diferente',
      )
    }

    const existentAttachmentsIds =
      await this.questionAttachmentsRepository.findManyByQuestionId(questionId)
    const existentAttachments = new QuestionAttachmentList(
      existentAttachmentsIds,
    )

    const attachments = attachmentsIds.map((attachmentId) => {
      return QuestionAttachment.create({
        attachmentId: new UniqueEntityId(attachmentId),
        questionId: question.id,
      })
    })

    existentAttachments.update(attachments)

    question.title = title
    question.content = content
    question.attachments = existentAttachments

    await this.questionsRepository.save(question)

    return { question }
  }
}
