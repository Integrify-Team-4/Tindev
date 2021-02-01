import express from 'express'
import tokenVerify from '../middlewares/tokenVerify'

import { createJobSeeker, updateJobSeeker } from '../controllers/jobSeeker'
import { jobseekerMatch } from '../controllers/match'

const router = express.Router()

router.post('/', createJobSeeker)
router.get('/match', tokenVerify, jobseekerMatch)
router.patch('/', tokenVerify, updateJobSeeker)

export default router
