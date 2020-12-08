import request from 'supertest'
import connection from '../db-helper'
import app from '../../src/app'

process.on('uncaughtException', function (err) {
  console.log('oh no', err);
});

const jobSeeker = {
  info: {
    firstName: 'duy',
    lastName: 'nguyen',
    contact: 1234,
    relocate: true,
    seniority: 'mid',
    startingDate: '10/12/2020',
  },
  credential: {
    email: 'abc@gmail.com',
    password: 'password',
  },
  skills: [
    { name: 'javascript' },
    { name: 'nodejs' },
    { name: 'reactjs' },
    { name: 'react' },
    { name: 'typescript' },
    { name: 'docker' },
    { name: 'aws' },
    { name: 'iac' },
  ]
}

const jobPost_1 = {
  title: 'Fullstack React- & Node.js Developer',
  jobDescription: 'We create and operate the online shops of Klamotten. Your job is to participate in the further development of our existing shop system platform',
  seniority: 'Junior',
  createdAt: "01/12/2020",
  requiredSkills: [
    { name: 'javascript' },
    { name: 'reactjs' },
    { name: 'nodejs' },
  ]
}

const jobPost_2 = {
  title: 'Fullstack React- & Node.js Developer',
  jobDescription: 'We create and operate the online shops of Klamotten. Your job is to participate in the further development of our existing shop system platform',
  seniority: 'Senior',
  createdAt: "01/12/2020",
  requiredSkills: [
    { name: 'javascript' },
    { name: 'reactjs' },
    { name: 'nodejs' },
    { name: 'react' },
    { name: 'typescript' },
  ]
}

const jobPost_3 = {
  title: 'Cloud Architect',
  jobDescription: 'Create cloud solutions',
  seniority: 'Junior',
  createdAt: "01/12/2020",
  requiredSkills: [
    { name: 'docker' },
    { name: 'gcp' },
    { name: 'iac' },
  ]
}

const jobPosts = [jobPost_1, jobPost_2, jobPost_3]

const employer_1 = {
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
    // { jobPost_1 }, 
    // { jobPost_2 }
    {
      title: 'Fullstack React- & Node.js Developer',
      jobDescription: 'We create and operate the online shops of Klamotten. Your job is to participate in the further development of our existing shop system platform',
      seniority: 'Junior',
      createdAt: "01/12/2020",
      requiredSkills: [
      { name: 'javascript' },
      { name: 'reactjs' },
      { name: 'nodejs' },
    ]
    },
    {
      title: 'Fullstack React- & Node.js Developer',
      jobDescription: 'We create and operate the online shops of Klamotten. Your job is to participate in the further development of our existing shop system platform',
      seniority: 'Senior',
      createdAt: "01/12/2020",
      requiredSkills: [
      { name: 'javascript' },
      { name: 'reactjs' },
      { name: 'nodejs' },
      { name: 'react' },
      { name: 'typescript' },
      ]
    }
  ]
}

const employer_2 = {
  info: {
    companyName: 'google',
    companyInfo: 'google-home',
    address: 'google-address',
  },
  credential: {
    email: 'google1@gmail.com',
    password: 'password',
  },
  jobPosts: [
    { jobPost_3 },
  ]
}

const createJobSeeker = async () =>
  await request(app).post('/jobSeeker/create').send(jobSeeker)

const creatingSkills = async () => {
  await request(app).post('/skills/create').send({ name: 'javascript' })
  await request(app).post('/skills/create').send({ name: 'reactjs' })
  await request(app).post('/skills/create').send({ name: 'typescript' })
  await request(app).post('/skills/create').send({ name: 'react' })
  await request(app).post('/skills/create').send({ name: 'nodejs' })
  await request(app).post('/skills/create').send({ name: 'docker' })
  await request(app).post('/skills/create').send({ name: 'aws' })
  await request(app).post('/skills/create').send({ name: 'gcp' })
  await request(app).post('/skills/create').send({ name: 'iac' })
}

const createJobPost = async () => {
  await request(app).post('/employer/jobs').send(jobPost_1)
  await request(app).post('/employer/jobs').send(jobPost_2)
  await request(app).post('/employer/jobs').send(jobPost_3)
}

const registerEmployer = async () => {
  await request(app).post('/employer').send(employer_1)
  await request(app).post('/employer').send(employer_2)
}

const match = async (): Promise<any> => {
  await request(app).post('/employer/jobs/match').send(jobPosts)
  await request(app).post('/jobSeeker/match').send(jobSeeker)
}

describe('match controller', () => {
  beforeAll(async () => {
    await connection.create()
  })

  beforeEach(async () => {
    await connection.clear()
  })

  afterAll(async () => {
    await connection.close()
  })

  it('should return jobseeker-company-match', async () => {
    await createJobSeeker()
    await creatingSkills()
    await createJobPost()
    await registerEmployer()
    
    const newUser = await request(app).get('/jobSeeker/1')
    console.log('newUser', newUser.body)
    const jobPosts = await request(app).get('/employer/jobs')
    console.log('jobposts', jobPosts.body)
    const employer = await request(app).get('/employer/1')
    console.log('employer', employer.body)
    const skills = await request(app).get('/skills')

    const response = await match()
    
    const jobPostMatches = await request(app).get('employer/jobs/match/:id')
    const jobSeekerMatches = await request(app).get('/jobSeeker/match/:id')
    console.log('jobPostMatches', jobPostMatches)
    console.log('jobSeekerMatches', jobSeekerMatches)
    
    expect(response.status).toBe(200)
  })
})


  
