import AppError from './app-error'

export default class UnauthorizedError extends AppError {
  constructor(message = 'Não autorizado') {
    super(message, 403)
  }
}
