import express from 'express'
import tokenVerify from '../middlewares/tokenVerify'

import {
  registerEmployer,
  createJobPost,
  updateJobPost,
  deleteJobPostbyId,
  updateEmployer,
} from '../controllers/employer'
import { employerMatch } from '../controllers/match'
const router = express.Router()

router.post('/', registerEmployer)
router.post('/jobs', tokenVerify, createJobPost)
router.patch('/jobs/:id', tokenVerify, updateJobPost)
router.patch('/', tokenVerify, updateEmployer)
router.delete('/jobs/:id', tokenVerify, deleteJobPostbyId)
router.get('/match', tokenVerify, employerMatch)
export default router
