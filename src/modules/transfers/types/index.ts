export interface CreateTransferInput {
  amount: number
  senderId: number
  receiverId: number
}
export interface Transfer {
  id: number
  amount: number
  senderId: number
  receiverId: number
  createdAt: Date
  updatedAt: Date
}
