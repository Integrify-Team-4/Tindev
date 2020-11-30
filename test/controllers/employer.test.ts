import request from 'supertest'
import connection from '../db-helper'
import app from '../../src/app'

const createEmployer = async () => {
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

  await request(app).post('/employer/create').send(form)
}

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

    const response = await request(app).post('/employer/create').send(form)

    expect(response.status).toBe(200)
    expect(response.body.message).toBe('Registered Successfully')
  })

  it('should login employer', async () => {
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

    await request(app).post('/employer/create').send(employer)

    const loginInput = {
      email: employer.credential.email,
      password: employer.credential.password,
    }

    const response = await request(app)
      .post('/employer/login/local')
      .send(loginInput)

    console.log(response.body)

    expect(response.status).toBe(200)
    expect(response.body.companyName).toBe('google')
    expect(response.body.id).toBe(1)
  })

  it('should create a new job post', async () => {
    const jobPost = {
      title: 'Fullstack React- & Node.js Developer',
      jobDescription:
        'We create and operate the online shops of Klamotten. Your job is to participate in the further development of our existing shop system platform',
      seniority: 'Junior',
    }

    await createEmployer()

    const response = await request(app)
      .post('/employer/jobs/google')
      .send(jobPost)

    console.log(response.body)
    expect(response.status).toBe(200)
    expect(response.body.message).toBe('Posted')
  })


  it('should delete the job',async()=>{
    const jobPost = {
      title: 'Fullstack React- & Node.js Developer',
      jobDescription:
        'We create and operate the online shops of Klamotten. Your job is to participate in the further development of our existing shop system platform',
      seniority: 'Junior',
    }

    await createEmployer()

     await request(app)
      .post('/employer/jobs/google')
      .send(jobPost)

    const response = await request(app).delete('/employer/jobs/1')
    
    
    expect(response.status).toBe(200)
    expect(response.body.message).toBe('success')
  })

  
})
