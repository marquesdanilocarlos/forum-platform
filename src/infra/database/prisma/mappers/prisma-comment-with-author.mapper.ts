import CommentWithAuthor from '@/domain/forum/enterprise/entities/value-objects/comment-with-author'
import {
  Comment as PrismaComment,
  User as PrismaUser,
} from '../../../../../generated/prisma/client'
import UniqueEntityId from '@/core/entities/unique-entity-id'

type PrismaCommentWithAuthor = PrismaComment & {
  author: PrismaUser
}

export default class PrismaCommentWithAuthorMapper {
  static toDomain(raw: PrismaCommentWithAuthor): CommentWithAuthor {
    return CommentWithAuthor.create({
      commentId: new UniqueEntityId(raw.id),
      authorId: new UniqueEntityId(raw.author.id),
      authorName: raw.author.name,
      content: raw.content,
      createdAt: raw.createdAt,
      updatedAt: raw.updatedAt,
    })
  }
}
