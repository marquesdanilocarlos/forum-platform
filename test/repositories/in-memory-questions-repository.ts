import QuestionsRepository from '@/domain/forum/application/repositories/questions-repository'
import Question from '@/domain/forum/enterprise/entities/question'
import Slug from '@/domain/forum/enterprise/entities/value-objects/slug'
import PaginationParams from '@/core/types/pagination-params'
import { DomainEvents } from '@/core/events/domain-events'
import QuestionDetails from '@/domain/forum/enterprise/entities/value-objects/question-details'
import InMemoryAttachmentsRepository from './in-memory-attachments-repository'
import InMemoryStudentsRepository from './in-memory-students-repository'
import InMemoryQuestionAttachmentsRepository from './in-memory-question-attachments-repository'
import { NotFoundError } from '@/core/errors'

export default class InMemoryQuestionsRepository implements QuestionsRepository {
  public questions: Question[] = []

  constructor(
    private questionAttachmentsRepository: InMemoryQuestionAttachmentsRepository,
    private attachmentsRepository: InMemoryAttachmentsRepository,
    private studentsRepository: InMemoryStudentsRepository,
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

  async findBySlug(slug: Slug): Promise<Question | null> {
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

  async findDetailsBySlug(slug: Slug): Promise<QuestionDetails | null> {
    const question =
      this.questions.find((question) => question.slug.value === slug.value) ??
      null

    if (!question) {
      throw new NotFoundError('Pergunta não encontrada.')
    }

    const author = this.studentsRepository.students.find((student) => {
      return student.id.equals(question.authorId)
    })

    if (!author) {
      throw new NotFoundError('Autor não existe.')
    }

    const questionAttachments =
      this.questionAttachmentsRepository.attachments.filter(
        (questionAttachment) => {
          return questionAttachment.questionId.equals(question.id)
        },
      )

    const attachments = questionAttachments.map((questionAttachment) => {
      const attachment = this.attachmentsRepository.attachments.find(
        (attachment) => {
          return attachment.id.equals(questionAttachment.attachmentId)
        },
      )

      if (!attachment) {
        throw new NotFoundError(
          `Anexo com o id ${questionAttachment.attachmentId.value} não existe.`,
        )
      }

      return attachment
    })

    return QuestionDetails.create({
      questionId: question.id,
      authorId: question.authorId,
      authorName: author.name,
      title: question.title,
      slug: question.slug.value,
      content: question.content,
      bestAnswerId: question.bestAnswerId,
      attachments,
      createdAt: question.createdAt,
      updatedAt: question.updatedAt,
    })
  }
}
