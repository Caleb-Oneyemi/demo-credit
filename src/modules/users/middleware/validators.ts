import { ZodError } from 'zod'
import { Request, NextFunction } from 'express'
import { userCreationSchema } from './schemas'
import { BadRequestError, ConflictError, CustomResponse } from '../../../common'
import { getUserByEmail } from '../data'

export const userCreationValidator = async (
  req: Request,
  res: CustomResponse,
  next: NextFunction,
): Promise<void> => {
  try {
    await userCreationSchema.parseAsync(req.body)

    const existingUser = await getUserByEmail(req.body.email)
    if (existingUser) {
      return next(new ConflictError('Email already taken'))
    }

    next()
  } catch (err) {
    if (err instanceof ZodError) {
      next(new BadRequestError('', err))
    }
  }
}
