import httpStatus from 'http-status'
import { Router, Request, NextFunction } from 'express'
import { CustomResponse, NotAuthenticatedError } from '../../../common'
import { userLoginValidator } from '../middleware'
import { loginUser } from '../controllers'

const router = Router()

router.post(
  '/login',
  userLoginValidator,
  async (req: Request, res: CustomResponse, next: NextFunction) => {
    try {
      const data = await loginUser(req.body)
      if (!data) {
        throw new NotAuthenticatedError('invalid credentials')
      }

      res.status(httpStatus.OK).send({
        message: 'USER LOGIN SUCCESSFULLY',
        isSuccess: true,
        data,
      })
    } catch (err) {
      next(err)
    }
  },
)

export { router as authRoutes }
