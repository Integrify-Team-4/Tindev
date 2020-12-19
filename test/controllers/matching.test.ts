import { NextFunction, Request, Response } from 'express'
import request from 'supertest'
import connection from '../db-helper'
import app from '../../src/app'

import {
  createJobSeeker,
  createManySkills,
  createEmployer,
  loginJobSeeker,
  loginEmployer,
  createJobPost,
} from '../controller-helpers'
import { jobPostForm } from '../dto'

describe('Matcher controller', () => {
  beforeAll(async () => {
    await connection.create()
  })

  beforeEach(async () => {
    await connection.clear()
  })

  afterAll(async () => {
    await connection.close()
  })

  it('should find match', async () => {
    await createManySkills()
    await createEmployer()
    await createJobPost()
    const res2 = await createJobSeeker()
    const res5 = await request(app).get('/skills')

    const seeker = await loginJobSeeker()
    const employer = await loginEmployer()
    console.log(employer.body)

    const seekerToken = seeker.body.payload.token
    const employerToken = employer.body.payload.token
    const res4 = await request(app)
      .post(`/employer/jobs`)
      .set('Authorization', employerToken)
      .send(jobPostForm)

    const response = await request(app)
      .get('/jobSeeker/match')
      .set('Authorization', seekerToken)

    console.log(response.body.message)
    expect(res5.status).toBe(200)
    expect(res2.body.status).toBe(201)
    expect(res4.body.status).toBe(201)
    expect(response.status).toBe(200)
  })
})
