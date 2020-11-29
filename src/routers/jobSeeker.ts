import { findByCredentials } from './../controllers/logInJobSeeker'
import express from 'express'

import { getJobSeeker, createJobSeeker } from '../controllers/jobSeeker'

const router = express.Router()

router.get('/', getJobSeeker)
router.post('/create', createJobSeeker)
router.post('/login', findByCredentials)
export default router
