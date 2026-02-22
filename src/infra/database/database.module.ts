import { Module } from '@nestjs/common'
import { PrismaService } from './prisma/prisma.service'
import { PrismaQuestionAttachmentsRepository } from '@/infra/database/prisma/repositories/prisma-question-attachments.repository'
import { PrismaQuestionCommentsRepository } from '@/infra/database/prisma/repositories/prisma-question-comments.repository'
import { PrismaQuestionsRepository } from '@/infra/database/prisma/repositories/prisma-questions.repository'
import { PrismaAnswersRepository } from '@/infra/database/prisma/repositories/prisma-answers.repository'
import { PrismaAnswerAttachmentsRepository } from '@/infra/database/prisma/repositories/prisma-answer-attachments.repository'
import { PrismaAnswerCommentsRepository } from '@/infra/database/prisma/repositories/prisma-answer-comments.repository'
import QuestionsRepository from '@/domain/forum/application/repositories/questions-repository'
import StudentsRepository from '@/domain/forum/application/repositories/students-repository'
import { PrismaStudentsRepository } from '@/infra/database/prisma/repositories/prisma-students.repository'
import QuestionAttachmentsRepository from '@/domain/forum/application/repositories/question-attachments-repository'
import QuestionCommentsRepository from '@/domain/forum/application/repositories/question-comments-repository'
import AnswersRepository from '@/domain/forum/application/repositories/answers-repository'
import AnswerAttachmentsRepository from '@/domain/forum/application/repositories/answer-attachments-repository'
import AnswerCommentsRepository from '@/domain/forum/application/repositories/answer-comments-repository'

@Module({
  exports: [
    PrismaService,
    QuestionsRepository,
    QuestionAttachmentsRepository,
    QuestionCommentsRepository,
    AnswersRepository,
    AnswerAttachmentsRepository,
    AnswerCommentsRepository,
    StudentsRepository,
  ],
  providers: [
    PrismaService,
    {
      provide: QuestionsRepository,
      useClass: PrismaQuestionsRepository,
    },
    {
      provide: StudentsRepository,
      useClass: PrismaStudentsRepository,
    },
    {
      provide: QuestionAttachmentsRepository,
      useClass: PrismaQuestionAttachmentsRepository,
    },
    {
      provide: QuestionCommentsRepository,
      useClass: PrismaQuestionCommentsRepository,
    },
    {
      provide: AnswersRepository,
      useClass: PrismaAnswersRepository,
    },
    {
      provide: AnswerAttachmentsRepository,
      useClass: PrismaAnswerAttachmentsRepository,
    },
    {
      provide: AnswerCommentsRepository,
      useClass: PrismaAnswerCommentsRepository,
    },
  ],
})
export class DatabaseModule {}
