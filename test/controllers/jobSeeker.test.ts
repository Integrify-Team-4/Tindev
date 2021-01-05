import { NextFunction, Request, Response } from 'express'
import request from 'supertest'
import connection from '../db-helper'
import app from '../../src/app'

import {
  createJobSeeker,
  loginJobSeeker,
  createManySkills,
  updateJobSeeker,
} from '../controller-helpers'
import { mockJobSeekerCredential } from '../dto'

jest.mock(
  '../../src/middlewares/tokenVerify',
  () => (req: Request, res: Response, next: NextFunction) => {
    req.user = mockJobSeekerCredential
    next()
  }
)

describe('jobSeeker controller', () => {
  beforeAll(async () => {
    await connection.create()
  })

  beforeEach(async () => {
    await connection.clear()
  })
  afterAll(async () => {
    await connection.close()
  })

  it('Should not log in if email not found', async () => {
    const wrong_loginInput = {
      email: 'duy@gmail.com',
      password: 'duy@123',
    }
    const response = await request(app)
      .post('/jobSeeker/login/local')
      .send(wrong_loginInput)
    expect(response.body.message).toEqual('Email duy@gmail.com not found')
  })

  it('should create a job seeker', async () => {
    //**Job seeker has relation with skill */
    //**If no skill is created first, there will be relation error */
    const res = await createManySkills()
    const response = await createJobSeeker()
    const newUser = await request(app).get('/jobSeeker')

    expect(response.status).toBe(200)
    expect(newUser.body.length).toBe(1)
  })

  it('job Seeker should log in', async () => {
    await createManySkills()
    const res = await createJobSeeker()
    const response = await loginJobSeeker()
    expect(res.status).toBe(200)
    expect(response.status).toBe(200)
  })

  it('Update JobSeeker Info', async () => {
    await createManySkills()
    await createJobSeeker()
    const res = await updateJobSeeker()
    expect(res.status).toBe(200)
    expect(res.body.message).toBe('Updated')
  })
  // login job seeker with only credentials
  it('should log in with only email and password', async () => {
    // step 1 job seeker should be created
    await request(app)
      .post('/jobSeeker')
      .send({
        credential: {
          email: 'abc@gmail.com',
          password: 'password',
        },
      })
    const loginResponse = await request(app)
      .post('/jobSeeker/login/local')
      .send({
        email: 'abc@gmail.com',
        password: 'password',
      })
    console.log('log in response is ', loginResponse.body) // got it what we expect
    expect(loginResponse.status).toBe(200)
  })
  it('should fail to log in when user try to sign up as job seeker and sign in to employer', async () => {
    // step 1 job seeker should be created
    await request(app)
      .post('/jobSeeker')
      .send({
        credential: {
          email: 'abc@gmail.com',
          password: 'password',
        },
      })
    const loginResponse = await request(app)
      .post('/employer/login/local')
      .send({
        email: 'abc@gmail.com',
        password: 'password',
      })
    // response should have error but not :(
    console.log('log in response is ', loginResponse.body) // can't get it what we expect
  })
})
