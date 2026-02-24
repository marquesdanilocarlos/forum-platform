import Comment, {
  CommentProps,
} from '@/domain/forum/enterprise/entities/comment'

export default class CommentPresenter {
  static toHttp<T extends CommentProps>(comment: Comment<T>) {
    return {
      id: comment.id.value,
      content: comment.content,
      createdAt: comment.createdAt,
      updatedAt: comment.updatedAt,
    }
  }
}
