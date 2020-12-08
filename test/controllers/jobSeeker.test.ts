import { NextFunction, Request, Response } from 'express'
import jwt from 'jsonwebtoken'
import request from 'supertest'
import connection from '../db-helper'
import app from '../../src/app'

jest.mock(
  '../../src/middlewares/tokenVerify',
  () => (req: Request, res: Response, next: NextFunction) => next()
)
const form = {
  info: {
    firstName: 'duy',
    lastName: 'nguyen',
    contact: 1234,
    relocate: true,
    seniority: 'junior',
    startingDate: '10/12/2020',
  },
  credential: {
    email: 'abc@gmail.com',
    password: 'password',
  },
}

const jobSeeker = {
  info: {
    firstName: 'duy',
    lastName: 'nguyen',
    contact: 1234,
    relocate: true,
    seniority: 'junior',
    startingDate: '10/12/2020',
  },
  credential: {
    email: 'abc@gmail.com',
    password: 'password',
  },
}
const loginInput = {
  email: jobSeeker.credential.email,
  password: jobSeeker.credential.password,
}

const createJobSeeker = async () =>
  await request(app).post('/jobSeeker/create').send(form)

const logInJobSeeker = async () =>
  await request(app).post('/jobSeeker/login/local').send(loginInput)

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
  // user should fail to log in because of wrong email
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
    const response = await createJobSeeker()
    const newUser = await request(app).get('/jobSeeker')

    expect(response.status).toBe(200)
    expect(newUser.body.length).toBe(1)
  })

  // user should log in if credential is 100% matched

  it('job Seeker should log in', async () => {
    await createJobSeeker()
    const response = await logInJobSeeker()
    console.log('hello i am from job seeker login test file ', response.body)
    expect(response.status).toBe(200)
  })

  // Update JobSeeker
  it('Update JobSeeker Info', async () => {
    await createJobSeeker()
    const response = await logInJobSeeker()
    const jobSeekerId = response.body.id
    const update = {
      firstName: 'Update Duy',
      lastName: 'update lastname',
      contact: 12345,
      relocate: true,
      seniority: 'junior',
      startingDate: '10/12/2020',
    }
    const updateResponse = await request(app)
      .put(`/jobSeeker/update/${jobSeekerId}`)
      .send(update)
    console.log('update Response ', updateResponse.body)
    expect(response.status).toBe(200)
    expect(updateResponse.status).toBe(200)
  })

  // it('should match jobseeker with job posts', async () => {
  //   const response = await createJobSeeker()
  //   const newUser = await request(app).get('/jobSeeker')

  // })
})