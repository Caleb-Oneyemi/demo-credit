import { Account, User } from '../../../modules'

declare module 'express' {
  interface Request {
    user?: User
    account?: Account
  }
}
