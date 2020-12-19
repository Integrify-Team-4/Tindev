import request from 'supertest'
import connection from '../db-helper'
import app from '../../src/app'

import { createSkills, createManySkills } from '../controller-helpers'

describe('Skill controller', () => {
  beforeAll(async () => {
    await connection.create()
  })

  beforeEach(async () => {
    await connection.clear()
  })

  afterAll(async () => {
    await connection.close()
  })

  it('It should create a new skill', async () => {
    const skill = { name: 'java' }
    const res = await createSkills(skill)

    expect(res.status).toBe(200)
    expect(res.body.message).toBe('Success')
  })

  it('should return all the lists of skills', async () => {
    await createManySkills()
    const res = await request(app).get('/skills')
    console.log('list of skills ', res.body)
    expect(res.status).toBe(200)
  })
})
