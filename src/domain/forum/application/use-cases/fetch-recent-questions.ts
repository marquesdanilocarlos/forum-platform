import QuestionsRepository from '@/domain/forum/application/repositories/questions-repository'
import Question from '@/domain/forum/enterprise/entities/question'
import { Injectable } from '@nestjs/common'

type FetchRecentQuestionsInput = {
  page: number
}

type FetchRecentQuestionsOutput = {
  questions: Question[]
}

@Injectable()
export default class FetchRecentQuestions {
  constructor(private questionsRepository: QuestionsRepository) {}

  async execute({
    page,
  }: FetchRecentQuestionsInput): Promise<FetchRecentQuestionsOutput> {
    const questions = await this.questionsRepository.findManyRecent({ page })

    return { questions }
  }
}
