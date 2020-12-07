import request from 'supertest'
import connection from '../db-helper'
import app from '../../src/app'
import { match } from '../../src/controllers/match'

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
  skills: [
    { skill_1: 'javascript' },
    { skill_2: 'nodejs' },
    { skill_3: 'reactjs' },
    { skill_4: 'typescript' },
    { skill_5: 'html' },
    { skill_6: 'css' }
  ],
}

const jobPost_1 = {
  title: 'Fullstack React- & Node.js Developer',
  jobDescription: 'We create and operate the online shops of Klamotten. Your job is to participate in the further development of our existing shop system platform',
  seniority: 'Junior',
  createdAt: "01/12/2020",
  requiredSkills: {
    skill_1: 'javascript',
    skill_2: 'typescript'
  }
}

const jobPost_2 = {
  title: 'Fullstack React- & Node.js Developer',
  jobDescription: 'We create and operate the online shops of Klamotten. Your job is to participate in the further development of our existing shop system platform',
  seniority: 'Senior',
  createdAt: "01/12/2020",
  requiredSkills: {
    skill_1: 'javascript',
    skill_2: 'ruby',
    skill_3: 'rails'
  }
}

const employer = {
  info: {
    companyName: 'techeck',
    companyInfo: 'techeck-home',
    address: 'etcheck-address',
  },
  credential: {
    email: 'teckeck@gmail.com',
    password: 'password',
  },
  jobPosts: [
    {
      jobPost: jobPost_1
    },
    {
      jobPost: jobPost_2
    }
  ]
}

const loginInput = {
  email: jobSeeker.credential.email,
  password: jobSeeker.credential.password,
}

const createJobSeeker = async () =>
  await request(app).post('/jobSeeker/create').send(jobSeeker)

const logInJobSeeker = async () =>
  await request(app).post('/jobSeeker/login/local').send(loginInput)

const registerEmployer = async () => {
  await request(app).post('/employer/create').send(employer)
}

const creatingSkills = async () => {
  await request(app).post('/skills/create').send({ name: 'javascript' })
  await request(app).post('/skills/create').send({ name: 'reactjs' })
}

const createJobPost = async () => {
  await request(app).post('/employer/jobs/google').send(jobPost_1)
  await request(app).post('/employer/jobs/google').send(jobPost_2)
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
    //console.log(newUser.body)

    expect(response.status).toBe(200)
    expect(newUser.body.length).toBe(1)
  })

  // Login JobSeeker
  it('should login jobseeker', async () => {
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

  it('should match jobseeker skills with job posts skills', async () => {
    await createJobSeeker()
    const jobSeekers = await request(app).get('/jobSeeker')
    const jobSeekerId = jobSeekers.body[0].id
    createJobPost()
    registerEmployer()
    await match(jobSeekerId)
  })
})


