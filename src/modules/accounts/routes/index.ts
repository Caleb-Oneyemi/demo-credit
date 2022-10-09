import httpStatus from 'http-status'
import { Router, Request, NextFunction } from 'express'
import { CustomResponse, isAuthenticated } from '../../../common'
import {
  accountCreationValidator,
  accountUpdateValidator,
  accountBalanceValidator,
} from '../middleware'
import {
  createUserWallet,
  debitUserWallet,
  creditUserWallet,
} from '../controllers'

const router = Router()

router.post(
  '/',
  isAuthenticated,
  accountCreationValidator,
  async (req: Request, res: CustomResponse, next: NextFunction) => {
    try {
      const { amount } = req.body
      const data = await createUserWallet({
        ownerId: req.user?.id as number,
        balance: amount,
      })

      res.status(httpStatus.CREATED).send({
        message: 'WALLET CREATED SUCCESSFULLY',
        isSuccess: true,
        data,
      })
    } catch (err) {
      next(err)
    }
  },
)

router.patch(
  '/debit',
  isAuthenticated,
  accountUpdateValidator,
  accountBalanceValidator,
  async (req: Request, res: CustomResponse, next: NextFunction) => {
    try {
      const { amount } = req.body
      const data = await debitUserWallet({
        ownerId: req.user?.id as number,
        amount,
      })

      res.status(httpStatus.CREATED).send({
        message: 'WALLET DEBITED SUCCESSFULLY',
        isSuccess: true,
        data,
      })
    } catch (err) {
      next(err)
    }
  },
)

router.patch(
  '/credit',
  isAuthenticated,
  accountUpdateValidator,
  async (req: Request, res: CustomResponse, next: NextFunction) => {
    try {
      const { amount } = req.body
      const data = await creditUserWallet({
        ownerId: req.user?.id as number,
        amount,
      })

      res.status(httpStatus.CREATED).send({
        message: 'WALLET CREDITED SUCCESSFULLY',
        isSuccess: true,
        data,
      })
    } catch (err) {
      next(err)
    }
  },
)

export { router as accountRoutes }
