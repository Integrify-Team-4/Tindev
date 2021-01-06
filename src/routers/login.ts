import express from 'express'
import { jobSeekerLocalLogin as user } from '../controllers/login'

const router = express.Router()

router.post('/login/local', user)

export default router
