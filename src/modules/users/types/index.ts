export interface CreateUserInput {
  name: string
  email: string
  password: string
}

export interface User {
  id: number
  name: string
  email: string
  password: string
  createdAt: Date
  updatedAt: Date
}
