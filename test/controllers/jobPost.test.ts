import request from 'supertest'
import connection from '../db-helper'
import app from '../../src/app'

describe('jobPost controller', () => {
  beforeAll(async () => {
    await connection.create()
  })

  beforeEach(async () => {
    await connection.clear()
  })

  afterAll(async () => {
    await connection.close()
  })
})

it('should create a new job post', async () => {
  const jobPost = {
    title: "Fullstack React- & Node.js Developer",
    jobDescription: "We create and operate the online shops of Klamotten. Your job is to participate in the further development of our existing shop system platform",
    seniority: "Junior",
    createdAt: 28/11/2020
  }

  const response = await request(app)
    .post('/jobPost/companyName/jobs')
    .send(jobPost)

  expect(response.status).toBe(200)
  expect(response.body.message).toBe('Job post created successfully')
})