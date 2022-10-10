import supertest from 'supertest'
import * as Data from '../../users/data'
import { app } from '../../../app'
import { user } from '../../../test'
import { hashPassword } from '../../../common'

const request = supertest(app)

describe('AUTH TESTS', () => {
  describe('POST /api/auth/login', () => {
    test('User login fails when invalid input is sent', async () => {
      const result = await request.post('/api/auth/login').send({})

      expect(result.statusCode).toBe(400)
      expect(result.body.errors).toEqual([
        { message: 'Required', field: 'email' },
        { message: 'Required', field: 'password' },
      ])
      expect(result.body.isSuccess).toBe(false)
    })

    test('User login fails when email is invalid', async () => {
      const result = await request
        .post('/api/auth/login')
        .send({ email: 'wrongMail', password: user.password })

      expect(result.statusCode).toBe(400)
      expect(result.body.errors[0]).toEqual({
        message: 'Invalid email',
        field: 'email',
      })
      expect(result.body.isSuccess).toBe(false)
    })

    test('User login fails if user with email does not exist', async () => {
      jest
        .spyOn(Data, 'getUserByEmail')
        .mockImplementation(async () => undefined)

      const result = await request
        .post('/api/auth/login')
        .send({ email: user.email, password: user.password })

      expect(result.statusCode).toBe(401)
      expect(result.body.errors).toEqual([
        {
          message: 'invalid credentials',
        },
      ])
      expect(result.body.isSuccess).toBe(false)
    })

    test('User login fails if user with email exists but password is invalid', async () => {
      jest.spyOn(Data, 'getUserByEmail').mockImplementation(async () => {
        return { ...user, createdAt: new Date(), updatedAt: new Date() }
      })

      const result = await request
        .post('/api/auth/login')
        .send({ email: user.email, password: 'wrongPassword' })

      expect(result.statusCode).toBe(401)
      expect(result.body.errors).toEqual([
        {
          message: 'invalid credentials',
        },
      ])
      expect(result.body.isSuccess).toBe(false)
    })

    test('User login succeeds after passing requirements', async () => {
      const hash = await hashPassword(user.password)
      jest.spyOn(Data, 'getUserByEmail').mockImplementation(async () => {
        return {
          ...user,
          password: hash,
          createdAt: new Date(),
          updatedAt: new Date(),
        }
      })

      const result = await request.post('/api/auth/login').send({
        password: user.password,
        email: user.email,
      })

      expect(result.statusCode).toBe(200)
      expect(result.body.isSuccess).toBe(true)
      expect(result.body.data.token).toBeDefined()
      expect(result.body.data).toMatchObject({
        id: user.id,
        name: user.name,
        email: user.email,
      })
    })
  })
})
