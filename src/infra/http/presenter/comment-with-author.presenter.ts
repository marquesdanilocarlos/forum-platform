import CommentWithAuthor from '@/domain/forum/enterprise/entities/value-objects/comment-with-author'

export default class CommentWithAuthorPresenter {
  static toHttp(commentWithAuthor: CommentWithAuthor) {
    return {
      commentId: commentWithAuthor.commentId.value,
      authorId: commentWithAuthor.authorId,
      authorName: commentWithAuthor.authorName,
      content: commentWithAuthor.content,
      createdAt: commentWithAuthor.createdAt,
      updatedAt: commentWithAuthor.updatedAt,
    }
  }
}
