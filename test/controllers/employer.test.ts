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

  it('should not login employer if email not found', async () => {
    const loginInput = {
      email: 'kirsi.trospe@gmail.com',
      password: 'kirsi',
    }

    const response = await request(app)
      .post('/employer/login/local')
      .send(loginInput)

    expect(response.body.message).toEqual(
      'Email kirsi.trospe@gmail.com not found'
    )
  })

  it('should create new employer', async () => {
    const form = {
      info: {
        companyName: 'google',
        companyInfo: 'google-home',
        address: 'google-address',
      },
      credential: {
        email: 'google1@gmail.com',
        password: 'password',
      },
    }

    const response = await request(app).post('/employer/create').send(form)

    expect(response.status).toBe(200)
    expect(response.body.message).toBe('Registered Successfully')
  })

  it('should login employer', async () => {
    const employer = {
      info: {
        companyName: 'google',
        companyInfo: 'google-home',
        address: 'google-address',
      },
      credential: {
        email: 'google1@gmail.com',
        password: 'password',
      }
    }

    await request(app).post('/employer/create').send(employer)

    const loginInput = {
      email: employer.credential.email,
      password: employer.credential.password
    }

    const response = await request(app)
    .post('/employer/login/local')
    .send(loginInput)

    expect(response.status).toBe(200)
    expect(response.body.message).toBe('Logged in successfully')
  })
})
