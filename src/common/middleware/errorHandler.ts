import httpStatus from 'http-status'
import { Request, NextFunction } from 'express'
import { CustomError } from '../errors'
import { CustomResponse } from '../types'
import { logger } from '../../logger'

export const errorHandler = (
  err: Error,
  req: Request,
  res: CustomResponse,
  next: NextFunction,
): CustomResponse => {
  if (err instanceof CustomError) {
    return res
      .status(err.statusCode)
      .send({ errors: err.serializeErrors(), isSuccess: false })
  }

  let message = err.message
  if (Object.prototype.hasOwnProperty.call(err, 'sql')) {
    logger.warn(err)
    message = 'something went wrong'
  }

  return res.status(httpStatus.INTERNAL_SERVER_ERROR).send({
    errors: [{ message }],
    isSuccess: false,
  })
}
