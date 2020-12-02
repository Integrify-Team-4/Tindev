import request from 'supertest'
import connection from '../db-helper'
import app from '../../src/app'

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
  it('Should not log in if email not found', async () => {
    const loginInput = {
      email: 'duy@gmail.com',
      password: 'duy@123',
    }
    const response = await request(app)
      .post('/jobSeeker/login/local')
      .send(loginInput)
    expect(response.body.message).toEqual('Email duy@gmail.com not found')
  })

  it('should create a job seeker', async () => {
    const response = await createJobSeeker()
    const newUser = await request(app).get('/jobSeeker')


    expect(response.status).toBe(200)
    expect(newUser.body.length).toBe(1)
  })

  // Login JobSeeker

  it('job Seeker should log in', async () => {
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

    const response1 = await request(app)
      .post('/jobSeeker/create')
      .send(jobSeeker)
    console.log('user created Successfully ', response1.body)
    const loginInput = {
      email: jobSeeker.credential.email,
      password: jobSeeker.credential.password,
    }
    const response = await request(app)
      .post('/jobSeeker/login/local')
      .send(loginInput)
    console.log(response.body)
    expect(response.status).toBe(200)
  })

  // Update JobSeeker
  it('Update JobSeeker Info', async () => {
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

    const response1 = await request(app)
      .post('/jobSeeker/create')
      .send(jobSeeker)

    const loginInput = {
      email: jobSeeker.credential.email,
      password: jobSeeker.credential.password,
    }
    const response = await request(app)
      .post('/jobSeeker/login/local')
      .send(loginInput)
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
  })
  it('job Seeker should log in', async () => {
    await createJobSeeker()
    const response = await logInJobSeeker()
    expect(response.status).toBe(200)
  })
})
