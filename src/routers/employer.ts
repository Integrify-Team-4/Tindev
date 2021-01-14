import express from 'express'
import tokenVerify from '../middlewares/tokenVerify'

import {
  registerEmployer,
  createJobPost,
  updateJobPost,
  deleteJobPostbyId,
  updateEmployer,
  getEmployer,
} from '../controllers/employer'
const router = express.Router()

router.post('/', registerEmployer)
router.get('/', tokenVerify, getEmployer)
router.post('/jobs', tokenVerify, createJobPost)
router.patch('/jobs/:id', tokenVerify, updateJobPost)
router.patch('/', tokenVerify, updateEmployer)
router.delete('/jobs/:id', tokenVerify, deleteJobPostbyId)
export default router
