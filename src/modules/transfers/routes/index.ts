import httpStatus from 'http-status'
import { Router, Request, NextFunction } from 'express'
import { CustomResponse, isAuthenticated } from '../../../common'
import { transferFunds, getAllTransfers } from '../controllers'
import { transferCreationValidator } from '../middleware'

const router = Router()

router.post(
  '/',
  isAuthenticated,
  transferCreationValidator,
  async (req: Request, res: CustomResponse, next: NextFunction) => {
    try {
      const { amount, receiverId } = req.body
      const data = await transferFunds({
        senderId: req.user?.id as number,
        receiverId,
        amount,
      })

      res.status(httpStatus.CREATED).send({
        message: 'TRANSFER SUCCESSFUL',
        isSuccess: true,
        data,
      })
    } catch (err) {
      next(err)
    }
  },
)

router.get(
  '/',
  isAuthenticated,
  async (req: Request, res: CustomResponse, next: NextFunction) => {
    try {
      const data = await getAllTransfers(req.user?.id as number)

      res.status(httpStatus.OK).send({
        message: 'TRANSFERS RETRIEVED SUCCESSFULLY',
        isSuccess: true,
        data,
      })
    } catch (err) {
      next(err)
    }
  },
)

export { router as transferRoutes }
