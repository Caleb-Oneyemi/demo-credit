export const user = {
  id: 1,
  name: 'user1',
  email: 'user1@mail.co',
  password: 'pass',
}

export const account = {
  id: 1,
  balance: 100,
  ownerId: user.id,
  createdAt: new Date(),
  updatedAt: new Date(),
}

export const transfer = {
  id: 1,
  amount: 100,
  senderId: user.id,
  receiverId: 2,
  createdAt: new Date(),
  updatedAt: new Date(),
}
