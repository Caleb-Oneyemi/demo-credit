import { ResponseData } from '../../../common'
import { Account, CreateAccountInput, UpdateAccountInput } from '../types'
import {
  createAccount,
  deductAmountFromAccountBalance,
  addAmountToAccountBalance,
  getAccountById,
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
  const id = await deductAmountFromAccountBalance(input)
  return getAccountById(id) as Promise<Account>
}

export const creditUserWallet = async (
  input: UpdateAccountInput,
): Promise<ResponseData> => {
  const id = await addAmountToAccountBalance(input)
  return getAccountById(id) as Promise<Account>
}
