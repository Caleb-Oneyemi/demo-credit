import jwt, { JwtPayload } from 'jsonwebtoken'
import { CreateUserInput } from '../../modules/user'

export const generateToken = (
  id: number,
  { name, email }: CreateUserInput,
): string => {
  const signature = process.env.JWT_SECRET as string
  const token = jwt.sign({ id, name, email }, signature, { expiresIn: '6h' })
  return token
}

export const validateToken = (token: string) => {
  const signature = process.env.JWT_SECRET as string
  const payload = jwt.verify(token, signature) as JwtPayload
  return payload
}
