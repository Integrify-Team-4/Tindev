import request from 'supertest'
import connection from '../db-helper'
import app from '../../src/app'

process.on('uncaughtException', function (err) {
  console.log('oh no', err);
});

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

const jobPost1Skills = async () => {
  await request(app).get('/skills/1').send({ name: 'javascript' })
  await request(app).get('/skills/2').send({ name: 'reactjs' })
  await request(app).get('/skills/5').send({ name: 'nodejs' })
}

const jobPost2Skills = async () => {
  await request(app).get('/skills/1').send({ name: 'javascript' })
  await request(app).get('/skills/2').send({ name: 'reactjs' })
  await request(app).get('/skills/3').send({ name: 'typescript' })
  await request(app).get('/skills/4').send({ name: 'react' })
  await request(app).get('/skills/5').send({ name: 'nodejs' })
  await request(app).get('/skills/6').send({ name: 'docker' })
}

const jobPost3Skills = async () => {
  await request(app).get('/skills/7').send({ name: 'aws' })
  await request(app).get('/skills/8').send({ name: 'gcp' })
  await request(app).get('/skills/9').send({ name: 'iac' })
}

const jobSeekerSkills = async () => {
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
  skills: jobSeekerSkills()
}

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
// Ok
const loginInput = {
  email: jobSeeker.credential.email,
  password: jobSeeker.credential.password,
}

// This doesn't work
const createJobSeeker = async () =>
  await request(app).post('/jobSeeker/create').send(jobSeeker)

const logInJobSeeker = async () =>
  await request(app).post('/jobSeeker/login/local').send(loginInput)

const registerEmployer = async () => {
  await request(app).post('/employer').send(employer_1)
  await request(app).post('/employer').send(employer_2)
}

const match = async (): Promise<any> => {
  await request(app).post('/employer/jobs/match').send(jobPosts)
  await request(app).post('/jobSeeker/match').send(jobSeeker)
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
    const response = await createJobSeeker() // doesn't work
    const newUser = await request(app).get('/jobSeeker')
    console.log('newUser', newUser.body)

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

    await request(app)
      .post('/jobSeeker/create')
      .send(jobSeeker)
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
    expect(response.status).toBe(200)
  })

  it('job Seeker should log in', async () => {
    await createJobSeeker()
    console.log('logginUser', jobSeeker)
    const response = await logInJobSeeker()
    expect(response.status).toBe(200)
  })

  it('should return jobseeker-company-match', async () => {
    const jobSeeker = await createJobSeeker() 
    console.log('jobSeeker', jobSeeker.body) // {}
    await creatingSkills()
    await createJobPost1()
    await createJobPost2()
    await createJobPost3()
    await registerEmployer()
    
    // NOT OK
    const newUser = await request(app).get(`/jobSeeker`)
    console.log('newwUser', newUser.body) // {}
    const jobPosts = await request(app).get('/employer/jobs')
    console.log('jobposts', jobPosts.body) // []
    const employer = await request(app).get('/employer/1')
    console.log('employer', employer.body) // []
    const skills = await request(app).get('/skills')
    console.log('skills', skills.body) // OK

    const response = await match()
    
    const jobPostMatches = await request(app).get('employer/jobs/match/:id')
    const jobSeekerMatches = await request(app).get('/jobSeeker/match/:id')
    console.log('jobPostMatches', jobPostMatches) // nix
    console.log('jobSeekerMatches', jobSeekerMatches) // nix

    expect(response.status).toBe(200)
  })
})


