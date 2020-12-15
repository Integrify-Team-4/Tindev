import express from 'express'
import tokenVerify from '../middlewares/tokenVerify'

import {
  localLogin,
  registerEmployer,
  createJobPost,
  updateJobPost,
  deleteJobPostbyId,
  updateEmployer,
} from '../controllers/employer'

const router = express.Router()

router.post('/login/local', localLogin)
router.post('/', registerEmployer)
router.post('/jobs', tokenVerify, createJobPost)
router.patch('/jobs/:id', tokenVerify, updateJobPost)
router.patch('/', tokenVerify, updateEmployer)
router.delete('/jobs/:id', tokenVerify, deleteJobPostbyId)

export default router
