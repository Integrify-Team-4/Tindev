import express from 'express'

import {
  localLogin,
  registerEmployer,
  createJobPost,
  updateJobPost,
  getJobPosts,
  updateEmployer,
  getEmployers,
} from '../controllers/employer'

const router = express.Router()

router.post('/login/local', localLogin)
router.post('/create', registerEmployer)
router.post('/jobs/:companyName', createJobPost)
router.put('/jobs/:id', updateJobPost)
router.get('/jobs', getJobPosts)
router.put('/:id', updateEmployer)
router.get('/', getEmployers)

export default router
