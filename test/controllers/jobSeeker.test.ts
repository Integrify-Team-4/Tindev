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

// TODO remove mock for fully e2e test
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
      .post('/login/local')
      .send(wrong_loginInput)
    expect(response.body.message).toEqual('Email duy@gmail.com not found')
  })

  it('should create a job seeker', async () => {
    //**Job seeker has relation with skill */
    //**If no skill is created first, there will be relation error */
    const res = await createManySkills()
    const response = await createJobSeeker()
    const newUser = await request(app).get('/user')

    expect(response.status).toBe(200)
    expect(newUser.body.payload).toHaveProperty('id')
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
    console.log(res.body)
    expect(res.status).toBe(200)
    expect(res.body.message).toBe('Updated')
  })
})
