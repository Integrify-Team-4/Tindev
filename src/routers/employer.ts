import express from 'express'

import {
  localLogin,
  registerEmployer,
  createJobPost,
  updateEmployer,
  deleteJobPostbyId,
  getEmployers,
} from '../controllers/employer'

const router = express.Router()

router.post('/login/local', localLogin)
router.post('/create', registerEmployer)
router.post('/jobs/:companyName', createJobPost)
router.put('/:id', updateEmployer)
router.get('/', getEmployers)

// deleting job post by id
router.delete('/jobs/:id', deleteJobPostbyId)

export default router
