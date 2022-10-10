import { db } from '../../../db'
import { Transfer, CreateTransferInput } from '../types'

export const handleTransfer = async (input: CreateTransferInput) => {
  const { senderId, receiverId, amount } = input
  let transferId: number | undefined

  await db.transaction(async (trx) => {
    const [res] = await Promise.all([
      db('transfers').insert(input).transacting(trx),
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

    transferId = res[0]
  })

  return transferId
}

export const getTransferById = async (id: number) => {
  return db<Transfer>('transfers').where('id', id).first()
}

export const getUserTransferHistory = async (id: number) => {
  return db<Transfer>('transfers')
    .where('senderId', id)
    .orWhere('receiverId', id)
}
