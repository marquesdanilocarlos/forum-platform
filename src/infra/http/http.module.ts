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

@Module({
  imports: [DatabaseModule, CryptographyModule],
  controllers: [
    CreateAccountController,
    AuthenticateController,
    CreateQuestionController,
    FetchRecentQuestionsController,
  ],
  providers: [
    CreateQuestion,
    FetchRecentQuestions,
    StudentAuthenticate,
    StudentRegister,
  ],
})
export class HttpModule {}
