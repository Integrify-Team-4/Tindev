import express from 'express'

import {
  localLogin,
  registerEmployer,
  createJobPost,
  updateJobPost,
  getJobPosts,
  deleteJobPostbyId,
  getEmployer,
  getEmployers,
  updateEmployer,
} from '../controllers/employer'
import { match } from '../controllers/match'

const router = express.Router()

router.post('/login/local', localLogin)
router.post('/create', registerEmployer)
router.post('/jobs/match', match)
router.post('/jobs/:companyName', createJobPost)
router.put('/jobs/:id', updateJobPost)
router.put('/:id', updateEmployer)
router.get('/jobs', getJobPosts)
router.get('/:id', getEmployer)
router.get('/', getEmployers)
router.get('/jobs/match/:id', match)

// deleting job post by id
router.delete('/jobs/:id', deleteJobPostbyId)

export default router
