import { ResponseData } from '../../../common'
import { Account, CreateAccountInput, UpdateAccountInput } from '../types'
import {
  createAccount,
  deductAmountFromAccountBalance,
  addAmountToAccountBalance,
  getAccountByOwnerId,
} from '../data'

export const createUserWallet = async (
  input: CreateAccountInput,
): Promise<ResponseData> => {
  const [id] = await createAccount(input)
  return { id, ...input }
}

export const debitUserWallet = async (
  input: UpdateAccountInput,
): Promise<ResponseData> => {
  await deductAmountFromAccountBalance(input)
  return getAccountByOwnerId(input.ownerId) as Promise<Account>
}

export const creditUserWallet = async (
  input: UpdateAccountInput,
): Promise<ResponseData> => {
  await addAmountToAccountBalance(input)
  return getAccountByOwnerId(input.ownerId) as Promise<Account>
}
