import { db } from '../../../db'
import { CreateUserInput, User } from '../types'

const insertNewUser = async (user: CreateUserInput): Promise<number[]> => {
  return db('users').insert(user)
}

const getUserByEmail = async (email: string) => {
  return db<User>('users').where('email', email).first()
}

export { insertNewUser, getUserByEmail }
