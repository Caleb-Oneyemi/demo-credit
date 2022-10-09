import { CustomError, ErrorResult } from './CustomError'

export class NotAuthorizedError extends CustomError {
  statusCode = 403

  constructor() {
    super('Not Authorized')

    Object.setPrototypeOf(this, NotAuthorizedError.prototype)
  }

  serializeErrors(): Array<ErrorResult> {
    return [{ message: 'Not Authorized' }]
  }
}
