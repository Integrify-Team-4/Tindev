import request from 'supertest'
import connection from '../db-helper'
import app from '../../src/app'

import { createJobPost, registerEmployer, updateJobPost } from './employer.test'
import { createJobSeeker } from './jobSeeker.test'

const skills = [
  {
    name: 'Javascript',
  },
  {
    name: 'Java',
  },
  {
    name: 'React',
  },
]
const createSkills = async (skill: { name: string }) => {
  return await request(app).post('/skills/create').send(skill)
}

const createManySkills = async () => {
  return await Promise.all(
    skills.map(async (skill) => await createSkills(skill))
  )
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

  it('should find match', async () => {
    const response1 = await createManySkills()
    const response2 = await createJobSeeker()
    const response3 = await registerEmployer()
    const response4 = await createJobPost()
    const response5 = await updateJobPost()
    const res = await request(app).get('/skills')
    console.log('all skills', res.body)

    console.log(response1[1].body)
    console.log(response2.body)
    console.log(response3.body)
    console.log(response4.body)
    console.log(response5.body)

    const response = await request(app).get('/jobSeeker/match/1')
    console.log(response.body)

    expect(response.status).toBe(200)
  })
})
