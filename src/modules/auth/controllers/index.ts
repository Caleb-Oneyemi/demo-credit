import { ResponseData, verifyPassword, generateToken } from '../../../common'
import { getUserByEmail } from '../../user'
import { LoginInput } from '../types'

export const loginUser = async ({
  email,
  password,
}: LoginInput): Promise<ResponseData> => {
  const user = await getUserByEmail(email)
  if (!user) return null

  const isPasswordValid = await verifyPassword(password, user.password)
  if (!isPasswordValid) return null

  const jwtToken = generateToken(user.id, user)
  return { ...user, token: jwtToken }
}
