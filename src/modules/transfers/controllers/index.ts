import { ResponseData } from '../../../common'
import { CreateTransferInput, Transfer } from '../types'
import {
  handleTransfer,
  getUserTransferHistory,
  getTransferById,
} from '../data'

export const transferFunds = async (
  input: CreateTransferInput,
): Promise<ResponseData> => {
  const id = await handleTransfer(input)
  if (typeof id !== 'number') return null
  return getTransferById(id) as Promise<Transfer>
}

export const getAllTransfers = async (id: number): Promise<ResponseData> => {
  return getUserTransferHistory(id)
}
