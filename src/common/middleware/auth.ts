import { Request, Response, NextFunction } from 'express'
import { TokenExpiredError } from 'jsonwebtoken'
import { validateToken } from '../utils'
import { NotAuthenticatedError } from '../errors'

export const isAuthenticated = (
  req: Request,
  res: Response,
  next: NextFunction,
): void => {
  const token = req.headers.authorization?.split('Bearer ')[1]
  if (!token) {
    return next(new NotAuthenticatedError('Not Authenticated'))
  }

  let user
  try {
    user = validateToken(token)
  } catch (err) {
    if (err instanceof TokenExpiredError) {
      return next(new NotAuthenticatedError('Token Expired'))
    }

    return next(new NotAuthenticatedError('Invalid Token'))
  }

  req.user = user
  next()
}
