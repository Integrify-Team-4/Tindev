import express from 'express'

import {
  getJobSeeker,
  jobSeekerLocalLogin,
  createJobSeeker,
  updateJobSeeker,
} from '../controllers/jobSeeker'

const router = express.Router()
router.get('/', getJobSeeker)
router.post('/create', createJobSeeker)
router.post('/login/local', jobSeekerLocalLogin)
router.put('/jobSeeker/:id', updateJobSeeker)

export default router
