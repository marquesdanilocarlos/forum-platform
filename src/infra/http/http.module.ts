import { Module } from '@nestjs/common'
import { CreateAccountController } from '@/infra/http/controllers/create-account.controller'
import { AuthenticateController } from '@/infra/http/controllers/authenticate.controller'
import { CreateQuestionController } from '@/infra/http/controllers/create-question.controller'
import { FetchRecentQuestionsController } from '@/infra/http/controllers/fetch-recent-questions.controller'
import { DatabaseModule } from '@/infra/database/database.module'
import CreateQuestion from '@/domain/forum/application/use-cases/create-question'
import FetchRecentQuestions from '@/domain/forum/application/use-cases/fetch-recent-questions'
import StudentAuthenticate from '@/domain/forum/application/use-cases/student-authenticate'
import StudentRegister from '@/domain/forum/application/use-cases/student-register'
import { CryptographyModule } from '@/infra/criptography/cryptography.module'
import GetQuestionBySlugController from '@/infra/http/controllers/get-question-by-slug.controller'
import GetQuestionBySlug from '@/domain/forum/application/use-cases/get-question-by-slug'
import { EditQuestionController } from '@/infra/http/controllers/edit-question.controller'
import EditQuestion from '@/domain/forum/application/use-cases/edit-question'
import { DeleteQuestionController } from '@/infra/http/controllers/delete-question.controller'
import DeleteQuestion from '@/domain/forum/application/use-cases/delete-question'
import { AnswerQuestionController } from '@/infra/http/controllers/answer-question.controller'
import AnswerQuestion from '@/domain/forum/application/use-cases/answer-question'
import { EditAnswerController } from '@/infra/http/controllers/edit-answer.controller'
import EditAnswer from '@/domain/forum/application/use-cases/edit-answer'
import DeleteAnswer from '@/domain/forum/application/use-cases/delete-answer'
import { DeleteAnswerController } from '@/infra/http/controllers/delete-answer.controller'
import FetchQuestionAnswers from '@/domain/forum/application/use-cases/fetch-question-answers'
import { FetchQuestionAnswersController } from '@/infra/http/controllers/fetch-question-answers.controller'
import { ChooseBestQuestionAnswerController } from '@/infra/http/controllers/choose-best-question-answer.controller'
import ChooseBestQuestionAnswer from '@/domain/forum/application/use-cases/choose-best-question-answer'
import { CommentOnQuestionController } from '@/infra/http/controllers/comment-on-question.controller'
import CommentOnQuestion from '@/domain/forum/application/use-cases/comment-on-question'
import { DeleteQuestionCommentController } from '@/infra/http/controllers/delete-question-comment.controller'
import DeleteQuestionComment from '@/domain/forum/application/use-cases/delete-question-comment'
import { CommentOnAnswerController } from '@/infra/http/controllers/comment-on-answer.controller'
import CommentOnAnswer from '@/domain/forum/application/use-cases/comment-on-answer'

@Module({
  imports: [DatabaseModule, CryptographyModule],
  controllers: [
    CreateAccountController,
    AuthenticateController,
    CreateQuestionController,
    FetchRecentQuestionsController,
    GetQuestionBySlugController,
    EditQuestionController,
    DeleteQuestionController,
    AnswerQuestionController,
    EditAnswerController,
    DeleteAnswerController,
    FetchQuestionAnswersController,
    ChooseBestQuestionAnswerController,
    CommentOnQuestionController,
    DeleteQuestionCommentController,
    CommentOnAnswerController,
  ],
  providers: [
    CreateQuestion,
    FetchRecentQuestions,
    StudentAuthenticate,
    StudentRegister,
    GetQuestionBySlug,
    EditQuestion,
    DeleteQuestion,
    AnswerQuestion,
    EditAnswer,
    DeleteAnswer,
    FetchQuestionAnswers,
    ChooseBestQuestionAnswer,
    CommentOnQuestion,
    DeleteQuestionComment,
    CommentOnAnswer,
  ],
})
export class HttpModule {}
