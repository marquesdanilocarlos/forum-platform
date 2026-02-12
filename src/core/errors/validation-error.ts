import AppError from './app-error'

type FieldError = {
  field: string
  message: string
}

export default class ValidationError extends AppError {
  constructor(public errors: FieldError[]) {
    super('Erro de validação', 422)
  }
}
