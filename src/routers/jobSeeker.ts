import express from 'express'

import {
  getJobSeeker,
  jobSeekerLocalLogin,
  createJobSeeker,
  updateJobSeeker,
} from '../controllers/jobSeeker'
import { match } from '../controllers/match'

const router = express.Router()
router.get('/', getJobSeeker)
router.get('/match/:id', match)
router.post('/create', createJobSeeker)
router.post('/login/local', jobSeekerLocalLogin)
router.post('/match', match)
router.put('/update/:id', updateJobSeeker)

export default router
