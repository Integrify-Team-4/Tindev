import express from 'express'

import { createJobPost } from '../controllers/jobPost'

const router = express.Router()

router.post('/companyName/jobs', createJobPost)

export default router
