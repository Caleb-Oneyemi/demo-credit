import { ZodError } from 'zod'
import { Request, NextFunction } from 'express'
import { loginSchema } from './schemas'
import { BadRequestError, CustomResponse } from '../../../common'

export const userLoginValidator = async (
  req: Request,
  res: CustomResponse,
  next: NextFunction,
): Promise<void> => {
  try {
    await loginSchema.parseAsync(req.body)
    next()
  } catch (err) {
    if (err instanceof ZodError) {
      next(new BadRequestError('', err))
    }
  }
}
