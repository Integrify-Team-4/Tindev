import express from 'express'

import {
  getJobSeeker,
  createJobSeeker,
  getJobSeekerByFirstName,
} from '../controllers/jobSeeker'

const router = express.Router()

router.get('/', getJobSeeker)
router.get('/:name', getJobSeekerByFirstName)
router.post('/create', createJobSeeker)

export default router
