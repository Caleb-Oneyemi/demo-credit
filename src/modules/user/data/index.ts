import { db } from '../../../db'
import { CreateUserInput } from '../types'

const insertNewUser = async (user: CreateUserInput): Promise<number[]> => {
  return db('users').insert(user)
}

export { insertNewUser }
