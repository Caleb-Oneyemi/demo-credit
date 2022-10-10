import { db } from '../../../db'
import { Account, CreateAccountInput, UpdateAccountInput } from '../types'

export const createAccount = async (
  account: CreateAccountInput,
): Promise<number[]> => {
  return db('accounts').insert(account)
}

export const getAccountByOwnerId = async (ownerId: number) => {
  return db<Account>('accounts').where('ownerId', ownerId).first()
}

export const getAccountById = async (id: number) => {
  return db<Account>('accounts').where('id', id).first()
}

export const deductAmountFromAccountBalance = async ({
  ownerId,
  amount,
}: UpdateAccountInput) => {
  return db<Account>('accounts')
    .where('ownerId', ownerId)
    .first()
    .decrement('balance', amount)
}

export const addAmountToAccountBalance = async ({
  ownerId,
  amount,
}: UpdateAccountInput) => {
  return db<Account>('accounts')
    .where('ownerId', ownerId)
    .first()
    .increment('balance', amount)
}
