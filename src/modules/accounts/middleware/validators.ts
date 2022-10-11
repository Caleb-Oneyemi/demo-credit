import { ZodError } from 'zod'
import { Request, NextFunction } from 'express'
import { accountUpsertSchema } from './schemas'
import { BadRequestError, CustomResponse, NotFoundError } from '../../../common'
import { getAccountByOwnerId } from '../data'

export const accountCreationValidator = async (
  req: Request,
  res: CustomResponse,
  next: NextFunction,
): Promise<void> => {
  try {
    await accountUpsertSchema.parseAsync(req.body)

    const account = await getAccountByOwnerId(req.user?.id as number)

    if (account) {
      return next(new BadRequestError('wallet already exists for user'))
    }

    next()
  } catch (err: any) {
    if (err instanceof ZodError) {
      next(new BadRequestError('', err))
    }

    next(new BadRequestError(err.message))
  }
}

export const accountUpdateValidator = async (
  req: Request,
  res: CustomResponse,
  next: NextFunction,
): Promise<void> => {
  try {
    await accountUpsertSchema.parseAsync(req.body)

    const account = await getAccountByOwnerId(req.user?.id as number)

    if (!account) {
      return next(new NotFoundError('no wallet found for existing user'))
    }

    req.account = account

    next()
  } catch (err: any) {
    if (err instanceof ZodError) {
      next(new BadRequestError('', err))
    }

    next(new BadRequestError(err.message))
  }
}

export const accountBalanceValidator = async (
  req: Request,
  res: CustomResponse,
  next: NextFunction,
): Promise<void> => {
  const balance = req.account?.balance as number
  if (balance < req.body.amount) {
    return next(new BadRequestError('insufficient funds'))
  }

  next()
}
