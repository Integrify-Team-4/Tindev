import { NextFunction, Request, Response } from 'express'
import request from 'supertest'

import connection from '../db-helper'
import {
  createJobPost,
  createEmployer,
  updateEmployer,
  updateJobPost,
  createManySkills,
} from '../controller-helpers'
import { mockEmployerCredential } from '../dto'
import app from '../../src/app'

jest.mock(
  '../../src/middlewares/tokenVerify',
  () => (req: Request, res: Response, next: NextFunction) => {
    req.user = mockEmployerCredential
    next()
  }
)

describe('employer controller', () => {
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
    const response = await createEmployer()
    expect(response.status).toBe(200)
    expect(response.body.message).toBe('Registered')
  })

  it('should update employer', async () => {
    await createEmployer()
    const response = await updateEmployer()

    expect(response.status).toBe(200)
    expect(response.body.message).toBe('Updated')
  })

  it('should create a new job post', async () => {
    await createManySkills()
    await createEmployer()
    const response = await createJobPost()
    expect(response.status).toBe(200)
    expect(response.body.message).toBe('Posted')
  })

  it('should update job post', async () => {
    await createManySkills()
    await createEmployer()
    await createJobPost()
    const res = await updateJobPost(1)

    expect(res.body.message).toBe('Updated')
  })

  it('should delete the job', async () => {
    await createManySkills()
    await createEmployer()
    await createJobPost()
    const response = await request(app).delete('/employer/jobs/1')
    expect(response.status).toBe(200)
    expect(response.body.message).toBe('Removed')
  })
})
