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

  it('should create a job seeker', async () => {
    const user = {
      firstName: 'duy',
      lastName: 'nguyen',
      email: 'abc@gmail.com',
      password: 'password',
      contact: 1234,
      relocate: true,
      seniority: 'junior',
      startingDate: '10/12/2020',
    }

    const response = await request(app).post('/jobSeeker/create').send(user)
    const newUser = await request(app).get('/jobSeeker')
    // console.log(newUser.body)

    expect(response.status).toBe(200)
    expect(newUser.body.length).toBe(1)
  })

})
