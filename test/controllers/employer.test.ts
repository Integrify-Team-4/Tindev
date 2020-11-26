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


  it('should create new employer', async () => {
    const employer = {
      companyName: 'google',
      email: 'google1@gmail.com',
      password: 'password',
      companyInfo: 'google-home',
      address: 'google-address'
    }

    const newEmployer = await request(app).post('/employer/create-employer').send(employer)
    console.log("newUser.body", newEmployer.body)

    expect(newEmployer.status).toBe(200)
    expect(newEmployer.body.msg).toBe('Registered Successfully')
  })
  
})