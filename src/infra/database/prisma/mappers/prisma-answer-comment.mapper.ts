import { Comment as PrismaComment } from '../../../../../generated/prisma/client'
import AnswerComment from '@/domain/forum/enterprise/entities/answer-comment'
import UniqueEntityId from '@/core/entities/unique-entity-id'
import { CommentUncheckedCreateInput } from '../../../../../generated/prisma/models/Comment'

export class PrismaAnswerCommentMapper {
  static toDomain(raw: PrismaComment): AnswerComment {
    if (!raw.answerId) {
      throw new Error('Comentário não pertence a uma resposta.')
    }

    return AnswerComment.create(
      {
        content: raw.content,
        answerId: new UniqueEntityId(raw.answerId),
        authorId: new UniqueEntityId(raw.authorId),
        createdAt: raw.createdAt,
        updatedAt: raw.updatedAt,
      },
      new UniqueEntityId(raw.id),
    )
  }

  static toPersistent(
    answerComment: AnswerComment,
  ): CommentUncheckedCreateInput {
    return {
      id: answerComment.id.value,
      authorId: answerComment.authorId.value,
      content: answerComment.content,
      answerId: answerComment.answerId.value,
      createdAt: answerComment.createdAt,
      updatedAt: answerComment.updatedAt,
    }
  }
}
