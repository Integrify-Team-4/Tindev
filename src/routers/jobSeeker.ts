import express from 'express'

import { getJobSeeker, createJobSeeker } from '../controllers/jobSeeker'

const router = express.Router()

router.get('/', getJobSeeker)
router.post('/create', createJobSeeker)

export default router
