import UseCaseError from '@/core/errors/use-case.error'

export default class WrongCredentialsError
  extends Error
  implements UseCaseError
{
  constructor() {
    super(`Credenciais inválidas`)
  }
}
