import { getUserByEmail, insertNewUser } from '../data'
import { CreateUserInput } from '../types'
import { ResponseData, hashPassword, generateToken } from '../../../common'

export const createUser = async (
  input: CreateUserInput,
): Promise<ResponseData> => {
  const existingUser = await getUserByEmail(input.email)
  if (existingUser) return null

  const hashedPassword = await hashPassword(input.password)
  const data = {
    ...input,
    password: hashedPassword,
  }

  const [id] = await insertNewUser(data)
  const jwtToken = generateToken(id, data)

  return { id, ...data, token: jwtToken }
}
