import { ZodError } from 'zod'
import { Request, NextFunction } from 'express'
import { transferCreationSchema } from './schemas'
import { BadRequestError, CustomResponse, NotFoundError } from '../../../common'
import { getAccountByOwnerId } from '../../accounts/data'

export const transferCreationValidator = async (
  req: Request,
  res: CustomResponse,
  next: NextFunction,
): Promise<void> => {
  try {
    await transferCreationSchema.parseAsync(req.body)
    const id = req.user?.id as number
    const { receiverId, amount } = req.body

    if (id === receiverId) {
      return next(
        new BadRequestError('sender and receiver wallet id must be different'),
      )
    }

    const [senderAccount, receiverAccount] = await Promise.all([
      getAccountByOwnerId(id),
      getAccountByOwnerId(receiverId),
    ])

    if (!senderAccount) {
      return next(new NotFoundError('no wallet found for existing user'))
    }

    if (!receiverAccount) {
      return next(new NotFoundError('destination wallet not found'))
    }

    if (senderAccount.balance < amount) {
      return next(new BadRequestError('insufficient funds'))
    }

    next()
  } catch (err) {
    if (err instanceof ZodError) {
      next(new BadRequestError('', err))
    }
  }
}
