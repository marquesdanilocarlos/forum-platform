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

@Module({
  exports: [
    PrismaService,
    QuestionsRepository,
    PrismaQuestionAttachmentsRepository,
    PrismaQuestionCommentsRepository,
    PrismaAnswersRepository,
    PrismaAnswerAttachmentsRepository,
    PrismaAnswerCommentsRepository,
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
    PrismaQuestionAttachmentsRepository,
    PrismaQuestionCommentsRepository,
    PrismaAnswersRepository,
    PrismaAnswerAttachmentsRepository,
    PrismaAnswerCommentsRepository,
  ],
})
export class DatabaseModule {}
