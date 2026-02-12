export default class AppError extends Error {
  constructor(
    message: string,
    public statusCode = 400,
  ) {
    super(message)
    this.name = this.constructor.name

    // Preserva a stack trace no V8
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, this.constructor)
    }
  }
}
