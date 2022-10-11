import supertest from 'supertest'
import * as TransferData from '../data'
import * as AccountData from '../../accounts/data'
import { app } from '../../../app'
import { user, account, transfer, SqlError } from '../../../test'
import { generateToken } from '../../../common'
import { logger } from '../../../logger'

const request = supertest(app)

let testToken: string

jest.mock('../../../logger', () => {
  return {
    logger: {
      warn: jest.fn(),
    },
  }
})

beforeAll(() => {
  testToken = generateToken(user.id, {
    name: user.name,
    email: user.email,
    password: user.password,
  })
})

describe('Transfers TESTS', () => {
  describe('POST /api/transfers', () => {
    test('Transfer fails when user is not authenticated', async () => {
      const result = await request.post('/api/transfers').send({})

      expect(result.statusCode).toBe(401)
      expect(result.body.errors).toEqual([{ message: 'Not Authenticated' }])
      expect(result.body.isSuccess).toBe(false)
    })

    test('Transfer fails when user is authenticated but invalid input is sent', async () => {
      const result = await request
        .post('/api/transfers')
        .set('Authorization', `Bearer ${testToken}`)
        .send({})

      expect(result.statusCode).toBe(400)
      expect(result.body.errors).toEqual([
        { message: 'Required', field: 'receiverId' },
        { message: 'Required', field: 'amount' },
      ])
      expect(result.body.isSuccess).toBe(false)
    })

    test('Transfer fails when amount to be sent is below one', async () => {
      const result = await request
        .post('/api/transfers')
        .set('Authorization', `Bearer ${testToken}`)
        .send({
          amount: 0.5,
          receiverId: 2,
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

    test('Transfer fails when sender and receiver are the same', async () => {
      const result = await request
        .post('/api/transfers')
        .set('Authorization', `Bearer ${testToken}`)
        .send({
          amount: 50,
          receiverId: user.id,
        })

      expect(result.statusCode).toBe(400)
      expect(result.body.isSuccess).toBe(false)
      expect(result.body.errors).toEqual([
        {
          message: 'sender and receiver wallet id must be different',
        },
      ])
    })

    test('Transfer fails when sender has no existing wallet', async () => {
      const receiverId = 2
      jest
        .spyOn(AccountData, 'getAccountByOwnerId')
        .mockImplementation(async (id) => {
          if (id === user.id) return undefined
          return { ...account, ownerId: receiverId }
        })

      const result = await request
        .post('/api/transfers')
        .set('Authorization', `Bearer ${testToken}`)
        .send({
          amount: 50,
          receiverId,
        })

      expect(result.statusCode).toBe(404)
      expect(result.body.isSuccess).toBe(false)
      expect(result.body.errors).toEqual([
        { message: 'no wallet found for existing user' },
      ])
    })

    test('Transfer fails when receiver has no existing wallet', async () => {
      const receiverId = 2
      jest
        .spyOn(AccountData, 'getAccountByOwnerId')
        .mockImplementation(async (id) => {
          if (id === user.id) return account
          return undefined
        })

      const result = await request
        .post('/api/transfers')
        .set('Authorization', `Bearer ${testToken}`)
        .send({
          amount: 50,
          receiverId,
        })

      expect(result.statusCode).toBe(404)
      expect(result.body.isSuccess).toBe(false)
      expect(result.body.errors).toEqual([
        { message: 'destination wallet not found' },
      ])
    })

    test('Transfer fails when sender account balance is less than amount being sent', async () => {
      const receiverId = 2
      jest
        .spyOn(AccountData, 'getAccountByOwnerId')
        .mockImplementation(async (id) => {
          if (id === user.id) return account
          return { ...account, id: 2, ownerId: receiverId }
        })

      const result = await request
        .post('/api/transfers')
        .set('Authorization', `Bearer ${testToken}`)
        .send({
          amount: account.balance + 100,
          receiverId,
        })

      expect(result.statusCode).toBe(400)
      expect(result.body.isSuccess).toBe(false)
      expect(result.body.errors).toEqual([{ message: 'insufficient funds' }])
    })

    test('Transfer fails if db transaction fails', async () => {
      const msg = 'db transaction failed, rolling back'

      jest
        .spyOn(TransferData, 'handleTransfer')
        .mockImplementation(() => Promise.reject(new SqlError(msg)))

      const result = await request
        .post('/api/transfers')
        .set('Authorization', `Bearer ${testToken}`)
        .send({
          amount: transfer.amount,
          receiverId: transfer.receiverId,
        })

      expect(result.statusCode).toBe(500)
      expect(result.body.isSuccess).toBe(false)
      expect(logger.warn).toHaveBeenCalledTimes(1)
      expect(result.body.errors).toMatchObject([
        {
          message: 'something went wrong',
        },
      ])
    })

    test('Transfer succeeds after passing requirements', async () => {
      jest
        .spyOn(TransferData, 'handleTransfer')
        .mockImplementation(async () => transfer.id)

      jest
        .spyOn(TransferData, 'getTransferById')
        .mockImplementation(async () => transfer)

      const result = await request
        .post('/api/transfers')
        .set('Authorization', `Bearer ${testToken}`)
        .send({
          amount: transfer.amount,
          receiverId: transfer.receiverId,
        })

      expect(result.statusCode).toBe(201)
      expect(result.body.isSuccess).toBe(true)
      expect(result.body.data).toMatchObject({
        id: transfer.id,
        amount: transfer.amount,
        senderId: transfer.senderId,
        receiverId: transfer.receiverId,
      })
    })
  })

  describe('GET /api/transfers', () => {
    test('Retrieving all transactions fails when user is not authenticated', async () => {
      const result = await request.get('/api/transfers').send({
        amount: 100,
      })

      expect(result.statusCode).toBe(401)
      expect(result.body.errors).toEqual([{ message: 'Not Authenticated' }])
      expect(result.body.isSuccess).toBe(false)
    })
  })
})
