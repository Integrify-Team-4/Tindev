import express from 'express'

import {
  localLogin,
  registerEmployer,
  createJobPost,
  updateJobPost,
  getJobPosts,
  deleteJobPostbyId,
  updateEmployer,
  getEmployers,
} from '../controllers/employer'
import { match } from '../controllers/match'

const router = express.Router()

router.post('/login/local', localLogin)
router.post('/create', registerEmployer)
router.post('/create', match)
router.post('/jobs/:companyName', createJobPost)
router.put('/jobs/:id', updateJobPost)
router.get('/jobs', getJobPosts)
router.get('/', getEmployers)
router.put('/:id', updateEmployer)

// deleting job post by id
router.delete('/jobs/:id', deleteJobPostbyId)

export default router
