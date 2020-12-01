import express from 'express'

import {
  localLogin,
  registerEmployer,
  createJobPost,
  getEmployers,
  updateEmployer,
} from '../controllers/employer'

const router = express.Router()

router.post('/login/local', localLogin)
router.post('/create', registerEmployer)
router.post('/jobs/:companyName', createJobPost)
router.get('/', getEmployers)
router.put('/:id', updateEmployer)

export default router
