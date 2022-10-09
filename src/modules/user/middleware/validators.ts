import { ZodError } from 'zod'
import { Request, NextFunction } from 'express'
import { accountCreationSchema } from './schemas'
import { BadRequestError, CustomResponse } from '../../../common'

export const userCreationValidator = async (
  req: Request,
  res: CustomResponse,
  next: NextFunction,
): Promise<void> => {
  try {
    await accountCreationSchema.parseAsync(req.body)
    next()
  } catch (err) {
    if (err instanceof ZodError) {
      next(new BadRequestError('', err))
    }
  }
}
