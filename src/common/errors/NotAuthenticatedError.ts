import { CustomError, ErrorResult } from './CustomError'

export class NotAuthenticatedError extends CustomError {
  statusCode = 401

  constructor() {
    super('Not Authenticated')

    Object.setPrototypeOf(this, NotAuthenticatedError.prototype)
  }

  serializeErrors(): Array<ErrorResult> {
    return [{ message: 'Not Authenticated' }]
  }
}
