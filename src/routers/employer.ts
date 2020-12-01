import express from 'express'

import {
  localLogin,
  registerEmployer,
  createJobPost,
} from '../controllers/employer'

const router = express.Router()

router.post('/login/local', localLogin)
router.post('/create', registerEmployer)
router.post('/jobs/:companyName', createJobPost)

export default router
