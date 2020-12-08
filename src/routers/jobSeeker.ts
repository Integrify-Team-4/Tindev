import express from 'express'
import tokenVerify from '../middlewares/tokenVerify'

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
router.put('/update/:id', tokenVerify, updateJobSeeker)

export default router
