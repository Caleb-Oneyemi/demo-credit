import { db } from '../../../db'
import { Transfer, CreateTransferInput } from '../types'

export const handleTransfer = async (input: CreateTransferInput) => {
  const { senderId, receiverId, amount } = input
  let transactionId = null

  await db.transaction(async (trx) => {
    const [res] = await Promise.all([
      db('transactions').insert(input).transacting(trx),
      db('accounts')
        .where('ownerId', senderId)
        .first()
        .decrement('balance', amount)
        .transacting(trx),
      db('accounts')
        .where('ownerId', receiverId)
        .first()
        .increment('balance', amount)
        .transacting(trx),
    ])

    transactionId = res[0]
  })

  return transactionId
}

export const getTransferById = async (id: number) => {
  return db<Transfer>('transactions').where('id', id)
}

export const getUserTransferHistory = async (id: number) => {
  return db<Transfer>('transactions')
    .where('senderId', id)
    .orWhere('receiverId', id)
}
