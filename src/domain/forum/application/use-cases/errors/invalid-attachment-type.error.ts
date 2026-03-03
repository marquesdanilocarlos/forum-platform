export default class InvalidAttachmentTypeError extends Error {
  constructor(type: string) {
    super(`Tipo de arquivo ${type} inválido`)
  }
}
