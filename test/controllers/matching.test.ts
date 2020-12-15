import { NextFunction, Request, Response } from 'express'
import request from 'supertest'
import connection from '../db-helper'
import app from '../../src/app'

const jobSeekerForm = {
  info: {
    firstName: 'duy',
    lastName: 'nguyen',
    contact: 1234,
    relocate: true,
    seniority: 'junior',
    startingDate: '10/12/2020',
  },
  credential: {
    email: 'abcd@gmail.com',
    password: 'VanKaLauda',
  },
  skills: [{ id: 1 }, { id: 2 }, { id: 3 }],
}

const newCreateJobSeeker = async () =>
  await request(app).post('/jobSeeker').send(jobSeekerForm)

const newJobSeekerLogin = async () =>
  await request(app)
    .post('/jobSeeker/login/local')
    .send(jobSeekerForm.credential)

import {
  createManySkills,
  createEmployer,
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
    const employer = await loginEmployer()
    await createJobPost() // this also should need token
    const res2 = await newCreateJobSeeker()
    expect(res2.status).toBe(200)
    const res5 = await request(app).get('/skills')
    const seeker = await newJobSeekerLogin()
    expect(seeker.status).toBe(200)

    const employer_token = employer.body.payload.token
    console.log('employer tokennnnnnnnnn----------', employer_token)
    const seeker_token = seeker.body.payload.token
    console.log('Seeker tokennnnnnnnnn----------', seeker_token)

    const res4 = await request(app)
      .post(`/employer/jobs`)
      .set('Authorization', `Bearer ${employer_token}`) // error says token is undefined
      .send(jobPostForm)
    console.log('response after creating job post.........', res4.body)

    const response = await request(app)
      .get('/jobSeeker/match')
      .set('Authorization', `Bearer ${seeker_token}`)

    console.log(response.body.message)
    expect(res5.status).toBe(200)
    expect(res4.status).toBe(200)
    expect(response.status).toBe(200)
  })
})
