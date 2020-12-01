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
  it('It should create a new skill', async () => {
    const name = { name: 'Java Developer' }
    const response = await request(app).post('/skills/create').send(name)

    expect(response.body.message).toBe('success to create skills')
    expect(response.status).toBe(200)
  })
})
