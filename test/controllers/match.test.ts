import request from 'supertest'
import connection from '../db-helper'
import app from '../../src/app'

process.on('uncaughtException', function (err) {
  console.log('oh no', err);
});

const creatingSkills = async () => {
  const skill1 = await request(app).post('/skills/create').send({ name: 'javascript' })
  const skill2 = await request(app).post('/skills/create').send({ name: 'reactjs' })
  const skill3 = await request(app).post('/skills/create').send({ name: 'typescript' })
  const skill4 = await request(app).post('/skills/create').send({ name: 'react' })
  const skill5 = await request(app).post('/skills/create').send({ name: 'nodejs' })
  const skill6 = await request(app).post('/skills/create').send({ name: 'docker' })
  const skill7 = await request(app).post('/skills/create').send({ name: 'aws' })
  const skill8 = await request(app).post('/skills/create').send({ name: 'gcp' })
  const skill9 = await request(app).post('/skills/create').send({ name: 'iac' })
  return [skill1, skill2, skill3, skill4, skill5, skill6, skill7, skill8, skill9]
}

const jobPost1Skills = async () => {
  await request(app).get('/skills/1')
  await request(app).get('/skills/2')
  await request(app).get('/skills/3')
}

const jobPost2Skills = async () => {
  await request(app).get('/skills/1')
  await request(app).get('/skills/2')
  await request(app).get('/skills/3')
  await request(app).get('/skills/4')
  await request(app).get('/skills/5')
  await request(app).get('/skills/6')
}

const jobPost3Skills = async () => {
  await request(app).get('/skills/7')
  await request(app).get('/skills/8')
  await request(app).get('/skills/9')
}

const skills = async (): Promise<request.Response> => {
  return await request(app).get('/skills')
}

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
    skills
  ]
}
console.log('JOBSEEKER', jobSeeker)

const jobPost_1 = {
  title: 'Fullstack React- & Node.js Developer',
  jobDescription: 'We create and operate the online shops of Klamotten. Your job is to participate in the further development of our existing shop system platform',
  seniority: 'Junior',
  createdAt: "01/12/2020",
  requiredSkills: jobPost1Skills()  
}

const jobPost_2 = {
  title: 'Fullstack React- & Node.js Developer',
  jobDescription: 'We create and operate the online shops of Klamotten. Your job is to participate in the further development of our existing shop system platform',
  seniority: 'Senior',
  createdAt: "01/12/2020",
  requiredSkills: jobPost2Skills()
}

const jobPost_3 = {
  title: 'Cloud Architect',
  jobDescription: 'Create cloud solutions',
  seniority: 'Junior',
  createdAt: "01/12/2020",
  requiredSkills: jobPost3Skills()
}

const createJobPost1 = async () => {
  await request(app).post('/employer/jobs/techeck').send(jobPost_1)
}

const getJobPost1 = async () => {
  await request(app).get('/employer/jobs/1').send(jobPost_1)
}

const createJobPost2 = async () => {
  await request(app).post('/employer/jobs/techeck').send(jobPost_2)
}

const getJobPost2 = async () => {
  await request(app).get('/employer/jobs/2').send(jobPost_2)
}

const createJobPost3 = async () => {
  await request(app).post('/employer/jobs/google').send(jobPost_3)
}

const getJobPost3 = async () => {
  await request(app).get('/employer/jobs/3').send(jobPost_3)
}
const jobPosts = [jobPost_1, jobPost_2, jobPost_3]

const employer_1 = {
  info: {
    companyName: 'techeck',
    companyInfo: 'techeck-home',
    address: 'techeck-address',
  },
  credential: {
    email: 'teckeck@gmail.com',
    password: 'password',
  },
  jobPosts: [
     getJobPost1(),
     getJobPost2()
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
    getJobPost3()
  ]
}

const createJobSeeker = async () =>
  await request(app).post('/jobSeeker/create').send(jobSeeker)

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
    // const jobSeeker = await createJobSeeker() 
    // console.log('jobSeeker', jobSeeker.body) // {}
    await creatingSkills()
    await createJobPost1()
    await createJobPost2()
    await createJobPost3()
    await registerEmployer()
    
    // NOT OK
    const newUser = await request(app).get(`/jobSeeker`)
    console.log('newwUser', newUser.body) // []
    const skills = await request(app).get('/skills')
    console.log('skills', skills.body) // OK
    const jobPosts = await request(app).get('/employer/jobs')
    console.log('jobposts', jobPosts.body) // jobPosts: []
    const employer = await request(app).get('/employer/1')
    console.log('employer', employer.body) // {}
    
    const response = await match()
    
    const jobPostMatches = await request(app).get('employer/jobs/match/:id')
    const jobSeekerMatches = await request(app).get('/jobSeeker/match/:id')
    console.log('jobPostMatches', jobPostMatches) // nix
    console.log('jobSeekerMatches', jobSeekerMatches) // nix

    expect(response.status).toBe(200)
  })

})

