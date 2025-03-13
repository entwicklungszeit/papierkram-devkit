export class PapierkramImportOperationError extends Error {
  constructor(public reason: 'not suitable' | 'api error', message?: string) {
    super(message)
  }

  static create(reason: 'not suitable' | 'api error', message?: string) {
    return new PapierkramImportOperationError(reason, message)
  }
}
