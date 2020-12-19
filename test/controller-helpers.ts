import request from 'supertest'
import app from '../src/app'
import {
  employerForm,
  employerLogin,
  updateEmployerInfo,
  updateJobPostForm,
  jobPostForm,
  jobSeekerForm,
  jobSeekerLogin,
  skillForm,
} from './dto'

export const createEmployer = async () =>
  await request(app).post('/employer').send(employerForm)

export const loginEmployer = async () =>
  await request(app).post('/employer/login/local').send(employerLogin)

export const updateJobPost = async (jobPostId: number) =>
  await request(app)
    .patch(`/employer/jobs/${jobPostId}`)
    .send(updateJobPostForm)

export const updateEmployer = async () =>
  await request(app).patch(`/employer`).send(updateEmployerInfo)

export const deleteJobPost = async (postId: number) =>
  await request(app).delete(`/employer/jobs/${postId}`)

export const createJobPost = async () =>
  await request(app).post(`/employer/jobs`).send(jobPostForm)

export const createJobSeeker = async () =>
  await request(app).post('/jobSeeker').send(jobSeekerForm)

export const loginJobSeeker = async () =>
  await request(app).post('/jobSeeker/login/local').send(jobSeekerLogin)

export const updateJobSeeker = async () =>
  await request(app).patch('/jobSeeker/update').send(jobSeekerLogin)

export const getJobSeeker = async () => await request(app).get('/jobSeeker')

export const createSkills = async (skill: { name: string }) =>
  await request(app).post('/skills').send(skill)

export const createManySkills = async () => {
  return await Promise.all(
    skillForm.map(async (skill) => await createSkills(skill))
  )
}
