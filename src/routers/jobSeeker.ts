import express from 'express'

import {
  getJobSeeker,
  jobSeekerLocalLogin,
  createJobSeeker,
} from '../controllers/jobSeeker'

const router = express.Router()

router.get('/', getJobSeeker)
router.post('/create', createJobSeeker)
router.post('/login/local', jobSeekerLocalLogin)

export default router
