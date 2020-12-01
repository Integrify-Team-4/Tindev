import express from 'express'

import {
  localLogin,
  registerEmployer,
  createJobPost,
  updateEmployer,
} from '../controllers/employer'

const router = express.Router()

router.post('/login/local', localLogin)
router.post('/create', registerEmployer)
router.post('/jobs/:companyName', createJobPost)
router.put('/:id', updateEmployer)

export default router
