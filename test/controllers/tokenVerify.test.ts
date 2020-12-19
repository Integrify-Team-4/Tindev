import { NextFunction, Request, Response } from 'express'
import jwt from 'jsonwebtoken'
import request from 'supertest'
import connection from '../db-helper'
import app from '../../src/app'

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
  await request(app).post('/jobSeeker').send(jobSeeker)

const logInJobSeeker = async () =>
  await request(app).post('/jobSeeker/login/local').send(loginInput)

describe('Test token middleware', () => {
  beforeAll(async () => {
    await connection.create()
  })

  beforeEach(async () => {
    await connection.clear()
  })
  afterAll(async () => {
    await connection.close()
  })
  it('job Seeker should create, log in and can read his profile', async () => {
    await createJobSeeker()
    const response = await logInJobSeeker()
    const update = {
      firstName: 'Update Duy',
      lastName: 'update lastname',
      contact: 12345,
      relocate: true,
      seniority: 'junior',
      startingDate: '10/12/2020',
    }
    const updateResponse = await request(app)
      .patch(`/jobSeeker/update`)
      .set('Authorization', `Bearer ${response.body.token}`)
      .send(update)

    expect(response.status).toBe(200)
    expect(response.status).toBe(200)
    expect(updateResponse.status).toBe(200)
  })
})
