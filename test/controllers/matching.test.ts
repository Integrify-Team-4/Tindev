import request from 'supertest'

import connection from '../db-helper'
import app from '../../src/app'
import {
  createManySkills,
  createEmployer,
  loginEmployer,
  createJobPost,
} from '../controller-helpers'
import { jobPostForm } from '../dto'

const createPost = async (token: string) =>
  await request(app)
    .post(`/employer/jobs`)
    .send(jobPostForm)
    .set('Authorization', `Bearer ${token}`)

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
}

const jobSeekerUpdate = {
  skills: [{ id: 1 }, { id: 2 }, { id: 3 }],
}

const newCreateJobSeeker = async () =>
  await request(app).post('/jobSeeker').send(jobSeekerForm)

const newJobSeekerLogin = async () =>
  await request(app).post('/login/local').send(jobSeekerForm.credential)

const updateJobSeeker = async (token: string) =>
  await request(app)
    .patch('/jobSeeker')
    .send(jobSeekerUpdate)
    .set('Authorization', `Bearer ${token}`)

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

    const seeker_token = seeker.body.payload.token
    await updateJobSeeker(seeker_token)

    const res4 = await request(app)
      .post(`/employer/jobs`)
      .set('Authorization', `Bearer ${employer_token}`)
      .send(jobPostForm)

    const response = await request(app)
      .get('/jobSeeker/match')
      .set('Authorization', `Bearer ${seeker_token}`)

    expect(res5.status).toBe(200)
    expect(res4.status).toBe(200)
    expect(response.status).toBe(200)
  })
})

describe('match result for employer', () => {
  beforeAll(async () => {
    await connection.create()
  })

  beforeEach(async () => {
    await connection.clear()
  })

  afterAll(async () => {
    await connection.close()
  })

  it('should find match for employer', async () => {
    await createManySkills()
    await createEmployer()
    const employer = await loginEmployer()
    const employer_token = employer.body.payload.token
    const jobPost = await createPost(employer_token)
    const res2 = await newCreateJobSeeker()
    expect(res2.status).toBe(200)
    const res5 = await request(app).get('/skills')
    const seeker = await newJobSeekerLogin()
    expect(seeker.status).toBe(200)

    const seeker_token = seeker.body.payload.token
    await updateJobSeeker(seeker_token)

    console.log(jobPost.body)
    const postId = jobPost.body.payload.id
    const res4 = await request(app)
      .post(`/employer/jobs`)
      .set('Authorization', `Bearer ${employer_token}`)
      .send(jobPostForm)

    const response = await request(app)
      .get(`/employer/match/${postId}`)
      .set('Authorization', `Bearer ${employer_token}`)
    console.log(response.body)

    expect(res5.status).toBe(200)
    expect(res4.status).toBe(200)
    expect(response.status).toBe(200)
  })
})
