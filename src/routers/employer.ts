import express from 'express'
import tokenVerify from '../middlewares/tokenVerify'

import {
  localLogin,
  registerEmployer,
  createJobPost,
  updateJobPost,
  getJobPosts,
  deleteJobPostbyId,
} from '../controllers/employer'
import { match } from '../controllers/match'

const router = express.Router()

router.post('/login/local', localLogin) // no need to verify token when user try to login
router.post('/create', registerEmployer) // no need to verify when new user try to sign up
router.post('/create', tokenVerify, match)
router.post('/jobs/:companyName', tokenVerify, createJobPost)
router.put('/jobs/:id', tokenVerify, updateJobPost)
router.get('/jobs', tokenVerify, getJobPosts)
// reading user profile

// deleting job post by id
router.delete('/jobs/:id', tokenVerify, deleteJobPostbyId)

export default router
