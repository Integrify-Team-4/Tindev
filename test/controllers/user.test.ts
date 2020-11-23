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

  it('get all users', async () => {
    const user1 = {
      firstName: 'duy',
      lastName: 'nguyen',
      age: 22,
    }

    const user2 = {
      firstName: 'na',
      lastName: 'nguyen',
      age: 21,
    }

    await request(app).post('/user/create').send(user1)
    await request(app).post('/user/create').send(user2)

    const result = await request(app).get('/user')
    console.log(result.body)

    expect(result.status).toBe(200)
    expect(result.body.length).toEqual(2)
  })

  it('get users by name', async () => {
    const user1 = {
      firstName: 'duy',
      lastName: 'nguyen',
      age: 22,
    }

    await request(app).post('/user/create').send(user1)
    const result = await request(app).get('/user/duy')
    console.log(result.body)

    expect(result.status).toBe(200)
    expect(result.body.length).toEqual(1)
  })

  it('should create a user', async () => {
    const user = {
      firstName: 'duy',
      lastName: 'nguyen',
      age: 22,
    }

    await request(app).post('/user/create').send(user)
    const result = await request(app).get('/user')

    console.log(result.body)
    expect(result.body.length).toEqual(1)
    expect(result.body[0]).toHaveProperty('id')
    expect(result.body[0]).toHaveProperty('firstName', 'duy')
  })
})
