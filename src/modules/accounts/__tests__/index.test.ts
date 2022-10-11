import supertest from 'supertest'
import * as Data from '../data'
import { app } from '../../../app'
import { user, account } from '../../../test'
import { generateToken } from '../../../common'

const request = supertest(app)

let testToken: string

beforeAll(() => {
  testToken = generateToken(user.id, {
    name: user.name,
    email: user.email,
    password: user.password,
  })
})

describe('ACCOUNT TESTS', () => {
  describe('POST /api/accounts', () => {
    test('Account creation fails when user is not authenticated', async () => {
      const result = await request.post('/api/accounts').send({
        amount: 100,
      })

      expect(result.statusCode).toBe(401)
      expect(result.body.errors).toEqual([{ message: 'Not Authenticated' }])
      expect(result.body.isSuccess).toBe(false)
    })

    test('Account creation fails when user is authenticated but invalid input is sent', async () => {
      const result = await request
        .post('/api/accounts')
        .set('Authorization', `Bearer ${testToken}`)
        .send({})

      expect(result.statusCode).toBe(400)
      expect(result.body.errors[0]).toEqual({
        message: 'Required',
        field: 'amount',
      })
      expect(result.body.isSuccess).toBe(false)
    })

    test('Account creation fails when wallet account already exists', async () => {
      jest
        .spyOn(Data, 'getAccountByOwnerId')
        .mockImplementation(async () => account)

      const result = await request
        .post('/api/accounts')
        .set('Authorization', `Bearer ${testToken}`)
        .send({
          amount: 100,
        })

      expect(result.statusCode).toBe(400)
      expect(result.body.isSuccess).toBe(false)
      expect(result.body.errors).toEqual([
        { message: 'wallet already exists for user' },
      ])
    })

    test('Account creation fails when amount to be deposited is below 1 naira', async () => {
      jest
        .spyOn(Data, 'getAccountByOwnerId')
        .mockImplementation(async () => undefined)

      const result = await request
        .post('/api/accounts')
        .set('Authorization', `Bearer ${testToken}`)
        .send({
          amount: 0.5,
        })

      expect(result.statusCode).toBe(400)
      expect(result.body.isSuccess).toBe(false)
      expect(result.body.errors).toEqual([
        {
          message: 'amount must equal or exceed 1 naira',
          field: 'amount',
        },
      ])
    })

    test('Account creation succeeds after passing requirements', async () => {
      const id = 5
      const input = {
        amount: 100,
      }
      jest.spyOn(Data, 'createAccount').mockImplementation(async () => [id])

      jest
        .spyOn(Data, 'getAccountByOwnerId')
        .mockImplementation(async () => undefined)

      const result = await request
        .post('/api/accounts')
        .set('Authorization', `Bearer ${testToken}`)
        .send(input)

      expect(result.statusCode).toBe(201)
      expect(result.body.isSuccess).toBe(true)
      expect(result.body.data).toEqual({
        balance: input.amount,
        id,
        ownerId: user.id,
      })
    })
  })

  describe('PATCH /api/accounts/credit', () => {
    test('Crediting account fails when user is not authenticated', async () => {
      const result = await request.patch('/api/accounts/credit').send({
        amount: 100,
      })

      expect(result.statusCode).toBe(401)
      expect(result.body.errors).toEqual([{ message: 'Not Authenticated' }])
      expect(result.body.isSuccess).toBe(false)
    })

    test('Crediting account fails when user is authenticated but invalid input is sent', async () => {
      const result = await request
        .patch('/api/accounts/credit')
        .set('Authorization', `Bearer ${testToken}`)
        .send({})

      expect(result.statusCode).toBe(400)
      expect(result.body.errors[0]).toEqual({
        message: 'Required',
        field: 'amount',
      })
      expect(result.body.isSuccess).toBe(false)
    })

    test('Crediting account fails when user does not have an existing wallet', async () => {
      jest
        .spyOn(Data, 'getAccountByOwnerId')
        .mockImplementation(async () => undefined)

      const result = await request
        .patch('/api/accounts/credit')
        .set('Authorization', `Bearer ${testToken}`)
        .send({ amount: 100 })

      expect(result.statusCode).toBe(404)
      expect(result.body.errors).toEqual([
        {
          message: 'no wallet found for existing user',
        },
      ])
      expect(result.body.isSuccess).toBe(false)
    })

    test('Crediting account succeeds after passing requirements', async () => {
      const sentAmount = 50
      const newBalance = account.balance + sentAmount
      jest
        .spyOn(Data, 'addAmountToAccountBalance')
        .mockImplementation(async () => account.id)

      jest
        .spyOn(Data, 'getAccountByOwnerId')
        .mockImplementationOnce(async () => account)
        .mockImplementationOnce(async () => {
          return { ...account, balance: newBalance }
        })

      const result = await request
        .patch('/api/accounts/credit')
        .set('Authorization', `Bearer ${testToken}`)
        .send({ amount: sentAmount })

      expect(result.statusCode).toBe(200)
      expect(result.body.data).toMatchObject({
        id: account.id,
        balance: newBalance,
        ownerId: user.id,
      })
      expect(result.body.isSuccess).toBe(true)
    })
  })

  describe('PATCH /api/accounts/debit', () => {
    test('Debiting account fails when user is not authenticated', async () => {
      const result = await request.patch('/api/accounts/debit').send({
        amount: 100,
      })

      expect(result.statusCode).toBe(401)
      expect(result.body.errors).toEqual([{ message: 'Not Authenticated' }])
      expect(result.body.isSuccess).toBe(false)
    })

    test('Debiting account fails when user is authenticated but invalid input is sent', async () => {
      const result = await request
        .patch('/api/accounts/debit')
        .set('Authorization', `Bearer ${testToken}`)
        .send({})

      expect(result.statusCode).toBe(400)
      expect(result.body.errors[0]).toEqual({
        message: 'Required',
        field: 'amount',
      })
      expect(result.body.isSuccess).toBe(false)
    })

    test('Debiting account fails when user does not have an existing wallet', async () => {
      jest
        .spyOn(Data, 'getAccountByOwnerId')
        .mockImplementation(async () => undefined)

      const result = await request
        .patch('/api/accounts/debit')
        .set('Authorization', `Bearer ${testToken}`)
        .send({ amount: 100 })

      expect(result.statusCode).toBe(404)
      expect(result.body.errors).toEqual([
        {
          message: 'no wallet found for existing user',
        },
      ])
      expect(result.body.isSuccess).toBe(false)
    })

    test('Debiting account fails when balance is less than the amount being sent', async () => {
      jest
        .spyOn(Data, 'getAccountByOwnerId')
        .mockImplementation(async () => account)

      const result = await request
        .patch('/api/accounts/debit')
        .set('Authorization', `Bearer ${testToken}`)
        .send({ amount: 105 })

      expect(result.statusCode).toBe(400)
      expect(result.body.errors).toEqual([
        {
          message: 'insufficient funds',
        },
      ])
      expect(result.body.isSuccess).toBe(false)
    })

    test('Debiting account succeeds after passing requirements', async () => {
      const sentAmount = 50
      const newBalance = account.balance - sentAmount

      jest
        .spyOn(Data, 'deductAmountFromAccountBalance')
        .mockImplementation(async () => account.id)

      jest
        .spyOn(Data, 'getAccountByOwnerId')
        .mockImplementationOnce(async () => account)
        .mockImplementationOnce(async () => {
          return { ...account, balance: newBalance }
        })

      const result = await request
        .patch('/api/accounts/debit')
        .set('Authorization', `Bearer ${testToken}`)
        .send({ amount: sentAmount })

      expect(result.statusCode).toBe(200)
      expect(result.body.data).toMatchObject({
        id: account.id,
        balance: newBalance,
        ownerId: user.id,
      })
      expect(result.body.isSuccess).toBe(true)
    })
  })
})
