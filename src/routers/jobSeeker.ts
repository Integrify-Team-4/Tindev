import express from 'express'
import tokenVerify from '../middlewares/tokenVerify'

import {
  getJobSeeker,
  jobSeekerLocalLogin,
  createJobSeeker,
  updateJobSeeker,
} from '../controllers/jobSeeker'
import { match } from '../controllers/match'

const router = express.Router()

router.get('/', tokenVerify, getJobSeeker)
router.post('/', createJobSeeker)
router.get('/match', tokenVerify, match)
router.post('/login/local', jobSeekerLocalLogin)
router.patch('/update', tokenVerify, updateJobSeeker)

export default router
