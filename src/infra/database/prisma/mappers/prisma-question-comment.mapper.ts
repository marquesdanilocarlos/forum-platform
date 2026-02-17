import { Comment as PrismaComment } from '../../../../../generated/prisma/client'
import QuestionComment from '@/domain/forum/enterprise/entities/question-comment'
import UniqueEntityId from '@/core/entities/unique-entity-id'
import { CommentUncheckedCreateInput } from '../../../../../generated/prisma/models/Comment'

export class PrismaQuestionCommentMapper {
  static toDomain(raw: PrismaComment): QuestionComment {
    if (!raw.questionId) {
      throw new Error('Comentário não pertence a uma resposta.')
    }

    return QuestionComment.create(
      {
        content: raw.content,
        questionId: new UniqueEntityId(raw.questionId),
        authorId: new UniqueEntityId(raw.authorId),
        createdAt: raw.createdAt,
        updatedAt: raw.updatedAt,
      },
      new UniqueEntityId(raw.id),
    )
  }

  static toPersistent(
    questionComment: QuestionComment,
  ): CommentUncheckedCreateInput {
    return {
      id: questionComment.id.value,
      authorId: questionComment.authorId.value,
      content: questionComment.content,
      questionId: questionComment.questionId.value,
      createdAt: questionComment.createdAt,
      updatedAt: questionComment.updatedAt,
    }
  }
}
