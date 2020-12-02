import request from 'supertest'
import connection from '../db-helper'
import app from '../../src/app'
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
  it('It should create a new skill', async () => {
    const name = { name: 'Java Developer' }
    const response = await request(app).post('/skills/create').send(name)

    expect(response.body.message).toBe('success to create skills')
    expect(response.status).toBe(200)
  })

  it('should return all the lists of skills', async () => {
    const skill_1 = { name: 'Java' }
    const skill_2 = { name: 'NodeJs' }
    await request(app).post('/skills/create').send(skill_1)
    await request(app).post('/skills/create').send(skill_2)
    const res = await request(app).get('/skills').send()
    console.log('list of skills ', res.body)
    expect(res.status).toBe(200)
  })
})
