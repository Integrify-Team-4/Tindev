import request from 'supertest'
import connection from '../db-helper'
import app from '../../src/app'
import { NotFoundError, UnauthorizedError } from '../../src/helpers/apiError'

describe('user controller', () => {
  beforeAll(async () => {
    await connection.create()
  })

  beforeEach(async () => {
    await connection.clear()
  })

  afterAll(async () => {
    await connection.close()
  })
})

it('should login employer', async () => {
  const loginInput = {
    email: 'kirsi.trospe@gmail.com',
    password: 'kirsi'
  }

  const response = await request(app)
    .post('/auth/login/local')
    .send(loginInput)

  expect(response.status).toBe(200)
})

it('should fail if email not found', async () => {
  const loginInput = {
    email: 'nein@gmail.com',
    password: 'kirsi'
  }

  const response = await request(app)
    .post('/auth/login/local')
    .send(loginInput)

  expect(response.status).toBe(404)
  expect(response.body.error).toEqual(NotFoundError)
})

it('should fail if wrong password', async () => {
  const loginInput = {
    email: 'kirsi.trospe@gmail.com',
    password: 'hello'
  }

  const response = await request(app)
    .post('/auth/login/local')
    .send(loginInput)
  
  expect(response.status).toBe(401)
  expect(response.body.error).toEqual(UnauthorizedError)
})