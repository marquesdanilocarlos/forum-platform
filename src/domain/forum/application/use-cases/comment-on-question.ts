import QuestionsRepository from '@/domain/forum/application/repositories/questions-repository'
import QuestionCommentsRepository from '@/domain/forum/application/repositories/question-comments-repository'
import QuestionComment from '@/domain/forum/enterprise/entities/question-comment'
import UniqueEntityId from '@/core/entities/unique-entity-id'
import { NotFoundError } from '@/core/errors'

export type CommentOnQuestionInput = {
  questionId: string
  authorId: string
  content: string
}

export type CommentOnQuestionOutput = {
  comment: QuestionComment
}

export default class CommentOnQuestion {
  constructor(
    private questionsRepository: QuestionsRepository,
    private questionCommentsRepository: QuestionCommentsRepository,
  ) {}

  async execute(
    input: CommentOnQuestionInput,
  ): Promise<CommentOnQuestionOutput> {
    const { questionId, authorId, content } = input
    const question = await this.questionsRepository.findById(questionId)

    if (!question) {
      throw new NotFoundError('Pergunta não encontrada')
    }

    const comment: QuestionComment = QuestionComment.create({
      questionId: new UniqueEntityId(questionId),
      authorId: new UniqueEntityId(authorId),
      content,
    })

    await this.questionCommentsRepository.create(comment)

    return { comment }
  }
}
