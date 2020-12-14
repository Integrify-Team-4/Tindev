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
router.get('/', getJobSeeker)
router.post('/login/local', jobSeekerLocalLogin)
router.post('/create', createJobSeeker)

router.post('/match', tokenVerify, match)
router.put('/update/:id', tokenVerify, updateJobSeeker)

export default router
