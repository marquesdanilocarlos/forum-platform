import UseCaseError from '@/core/errors/use-case.error'

export default class StudentAlreadyExistsError
  extends Error
  implements UseCaseError
{
  constructor(public identifier: string) {
    super(`Aluno "${identifier}" já existe.`)
  }
}
