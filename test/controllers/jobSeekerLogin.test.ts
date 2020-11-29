import request from 'supertest'
import connection from '../db-helper'
import app from '../../src/app'

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
  it('should login', async () => {
    const user = {
      email: 'abc@gmail.com',
      password: 'password',
    }
    const response = await request(app).post('/login')
    expect(response.status).toBe(200)
  })
})
