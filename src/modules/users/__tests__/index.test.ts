import supertest from 'supertest'
import * as Data from '../data'
import { app } from '../../../app'
import { user } from '../../../test'

const request = supertest(app)

describe('USER TESTS', () => {
  describe('POST /api/users', () => {
    test('User account creation fails when invalid input is sent', async () => {
      const result = await request.post('/api/users').send({})

      expect(result.statusCode).toBe(400)
      expect(result.body.errors).toEqual([
        { message: 'Required', field: 'name' },
        { message: 'Required', field: 'email' },
        { message: 'Required', field: 'password' },
      ])
      expect(result.body.isSuccess).toBe(false)
    })

    test('User account creation fails when email is invalid', async () => {
      const result = await request
        .post('/api/users')
        .send({ name: user.name, password: user.password, email: 'wrongMail' })

      expect(result.statusCode).toBe(400)
      expect(result.body.errors[0]).toEqual({
        message: 'Invalid email',
        field: 'email',
      })
      expect(result.body.isSuccess).toBe(false)
    })

    test('User account creation fails when email is taken', async () => {
      jest.spyOn(Data, 'getUserByEmail').mockImplementation(async () => {
        return { ...user, createdAt: new Date(), updatedAt: new Date() }
      })

      const result = await request
        .post('/api/users')
        .send({ name: user.name, password: user.password, email: user.email })

      expect(result.statusCode).toBe(400)
      expect(result.body.errors[0]).toEqual({
        message: 'email already taken',
      })
      expect(result.body.isSuccess).toBe(false)
    })

    test('User account creation succeeds after passing requirements', async () => {
      jest
        .spyOn(Data, 'getUserByEmail')
        .mockImplementation(async () => undefined)

      jest
        .spyOn(Data, 'insertNewUser')
        .mockImplementation(async () => [user.id])

      const result = await request.post('/api/users').send({
        name: user.name,
        password: user.password,
        email: user.email,
      })

      expect(result.statusCode).toBe(201)
      expect(result.body.isSuccess).toBe(true)
      expect(result.body.data.token).toBeDefined()
      expect(result.body.data.password).not.toBe(user.password)
      expect(result.body.data).toMatchObject({
        id: user.id,
        name: user.name,
        email: user.email,
      })
    })
  })
})
