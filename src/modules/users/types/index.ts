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
  created_at: Date
  updated_at: Date
}
