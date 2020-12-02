import request from 'supertest'

import connection from '../db-helper'
import app from '../../src/app'

const employer = {
  info: {
    companyName: 'google',
    companyInfo: 'google-home',
    address: 'google-address',
  },
  credential: {
    email: 'google1@gmail.com',
    password: 'password',
  },
}
const loginInput = {
  email: employer.credential.email,
  password: employer.credential.password,
}
const form = {
  info: {
    companyName: 'google',
    companyInfo: 'google-home',
    address: 'google-address',
  },
  credential: {
    email: 'google1@gmail.com',
    password: 'password',
  },
}
const jobPost = {
  title: 'Fullstack React- & Node.js Developer',
  jobDescription:
    'We create and operate the online shops of Klamotten. Your job is to participate in the further development of our existing shop system platform',
  seniority: 'Junior',
}
const registerEmployer = async () =>
  await request(app).post('/employer/create').send(form)

const loginEmployer = async () =>
  await request(app).post('/employer/login/local').send(loginInput)

const createJobPost = async () =>
  await request(app).post('/employer/jobs/google').send(jobPost)

describe('user controller', () => {
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
    const response = await request(app).post('/employer/create').send(form)
    expect(response.status).toBe(200)
    expect(response.body.message).toBe('Registered Successfully')
  })

  it('should login employer', async () => {
    await request(app).post('/employer/create').send(employer)

    const loginInput = {
      email: employer.credential.email,
      password: employer.credential.password,
    }

    const response = await request(app)
      .post('/employer/login/local')
      .send(loginInput)

    expect(response.status).toBe(200)
    expect(response.body.companyName).toBe('google')
    expect(response.body.id).toBe(1)
  })

  it('should update employer', async () => {
    await registerEmployer()

    const update = {
      info: {
        companyName: 'Updated company name',
        companyInfo: 'Updated company info',
        address: 'Updated address',
      },
      credential: {
        email: 'Updated email',
        password: 'Updated password',
      },
    }

    const response = await request(app).put(`/employer/jobs/1`).send(update)
    const employers = await request(app).get('/employer/jobs')

    console.log('employers', employers.body)

    expect(response.status).toBe(200)
    expect(response.body.message).toBe('Updated successfully')
  })

  it('should create a new job post', async () => {
    await registerEmployer()
    const response = await createJobPost()
    expect(response.status).toBe(200)
    expect(response.body.message).toBe('Posted')
  })

  it('should update job post', async () => {
    await registerEmployer()

    const response = await createJobPost()

    const jobPostId = response.body.savedJobPost.id
    const update = {
      title: 'Updated job title',
    }

    const response1 = await request(app)
      .put(`/employer/jobs/${jobPostId}`)
      .send(update)
    expect(response1.status).toBe(200)
    expect(response1.body.message).toBe('Updated')
  })

  it('should delete the job', async () => {
    await registerEmployer()
    await createJobPost()
    const response = await request(app).delete('/employer/jobs/1')
    expect(response.status).toBe(200)
    expect(response.body.message).toBe('success')
  })
})
