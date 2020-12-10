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
router.post('/create', createJobSeeker)
router.post('/match', tokenVerify, match)
router.post('/login/local', jobSeekerLocalLogin)
router.put('/update/:id', tokenVerify, updateJobSeeker)
//router.get('/user/me/', tokenVerify, readMyProfile)

export default router
