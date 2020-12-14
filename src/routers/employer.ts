import express from 'express'
import tokenVerify from '../middlewares/tokenVerify'

import {
  localLogin,
  registerEmployer,
  createJobPost,
  updateJobPost,
  getJobPosts,
  deleteJobPostById,
  updateEmployer,
} from '../controllers/employer'
import { match } from '../controllers/match'

const router = express.Router()

router.post('/login/local', localLogin)
router.post('/create', registerEmployer)
router.post('/create', tokenVerify, match)
router.put('/:id', tokenVerify, updateEmployer)

router.get('/jobs', tokenVerify, getJobPosts)
router.post('/jobs/:companyName', tokenVerify, createJobPost)
router.put('/jobs/:id', tokenVerify, updateJobPost)
router.delete('/jobs/:id', tokenVerify, deleteJobPostById)

export default router
