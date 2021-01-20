import express from 'express'
import tokenVerify from '../middlewares/tokenVerify'

import {
  getJobSeeker,
  createJobSeeker,
  updateJobSeeker,
} from '../controllers/jobSeeker'
import { match } from '../controllers/match'

const router = express.Router()

router.post('/', createJobSeeker)
router.get('/match', tokenVerify, match)
router.patch('/', tokenVerify, updateJobSeeker)

export default router
