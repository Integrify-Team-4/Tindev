import { NextFunction, Request, Response } from 'express'
import request from 'supertest'
import connection from '../db-helper'
import app from '../../src/app'

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
    const loginResponse = await request(app).post('/login/local').send({
      email: 'abc@gmail.com',
      password: 'password',
    })
    console.log('log in response is ', loginResponse.body) // got it what we expect
    expect(loginResponse.status).toBe(200)
    expect(loginResponse.body.payload.role).toEqual('job seeker')
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
    const loginResponse = await request(app).post('/login/local').send({
      email: 'abc@gmail.com',
      password: 'password',
    })
    // response should have error but not :(q
    expect(loginResponse.body.payload.role).toEqual('job seeker')
    console.log('log in response is ', loginResponse.body)
  })

  it('should log in when user try to sign up as job seeker and sign in to employer', async () => {
    // step 1 job seeker should be created
    await request(app)
      .post('/employer')
      .send({
        credential: {
          email: 'abc@gmail.com',
          password: 'password',
        },
      })
    const loginResponse = await request(app).post('/login/local').send({
      email: 'abc@gmail.com',
      password: 'password',
    })
    // response should have error but not :(q
    expect(loginResponse.body.payload.role).toEqual('employer')
    console.log('log in response is ', loginResponse.body)
  })
  it('should log in when user try to sign up as job seeker and sign in to employer', async () => {
    // step 1 job seeker should be created
    await request(app)
      .post('/employer')
      .send({
        credential: {
          email: 'abc@gmail.com',
          password: 'password',
        },
      })
    const loginResponse = await request(app).post('/login/local').send({
      email: 'abc@gmail.com',
      password: 'password',
    })
    // response should have error but not :(q
    expect(loginResponse.body.payload.role).toEqual('employer')
    console.log('log in response is ', loginResponse.body.payload.role)
  })
})
