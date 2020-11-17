import request from 'supertest'
import connection from '../db-helper'
import app from '../../src/app'

describe('user controller', () => {
  beforeAll(async () => {
    await connection
      .create()
      .then(() => console.log('connected'))
      .catch(() => console.log('something wrong'))
  })

  beforeEach(async () => {
    await connection
      .clear()
      .then(() => console.log('clearing db'))
      .catch(() => console.log('clearing problem'))
  })

  afterAll(async () => {
    await connection.close()
  })

  it('get all users', async () => {
    const result = await request(app).get('/user')
    expect(result.status).toBe(200)
    expect(result.body.length).toEqual(0)
  })

  it('should create a user', async () => {
    await request(app).post('/user/create')
    const result = await request(app).get('/user')

    console.log(result.body)
    expect(result.body.length).toEqual(1)
  })

  it('should create a user', async () => {
    await request(app).post('/user/create')
    const result = await request(app).get('/user')

    console.log(result.body)
    expect(result.body.length).toEqual(1)
  })
})
