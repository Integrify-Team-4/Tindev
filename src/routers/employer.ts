import express from 'express'

import {
  localLogin,
  registerEmployer,
  getEmployer,
  updateEmployer,
  createJobPost,
} from '../controllers/employer'

const router = express.Router()

router.post('/login/local', localLogin)
router.post('/create', registerEmployer)
router.post('/jobs/:companyName', createJobPost)
router.get('/', getEmployer)
router.put('/employer/:id', updateEmployer)

export default router
