export interface CreateAccountInput {
  balance: number
  ownerId: number
}

export interface UpdateAccountInput {
  amount: number
  ownerId: number
}

export interface Account {
  id: number
  balance: number
  ownerId: number
  createdAt: Date
  updatedAt: Date
}
