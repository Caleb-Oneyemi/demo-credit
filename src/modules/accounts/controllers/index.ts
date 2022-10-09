import { ResponseData } from '../../../common'
import { CreateAccountInput, UpdateAccountInput } from '../types'
import {
  createAccount,
  deductAmountFromAccountBalance,
  addAmountToAccountBalance,
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
  const data = await deductAmountFromAccountBalance(input)
  return data
}

export const creditUserWallet = async (
  input: UpdateAccountInput,
): Promise<ResponseData> => {
  const data = await addAmountToAccountBalance(input)
  return data
}
