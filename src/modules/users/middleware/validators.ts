import { ZodError } from 'zod'
import { Request, NextFunction } from 'express'
import { userCreationSchema } from './schemas'
import { BadRequestError, CustomResponse } from '../../../common'

export const userCreationValidator = async (
  req: Request,
  res: CustomResponse,
  next: NextFunction,
): Promise<void> => {
  try {
    await userCreationSchema.parseAsync(req.body)
    next()
  } catch (err) {
    if (err instanceof ZodError) {
      next(new BadRequestError('', err))
    }
  }
}
