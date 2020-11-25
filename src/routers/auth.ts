import express from 'express'

import { localLogin } from '../controllers/employerLogin'

const router = express.Router()

router.post('/login/local', localLogin)

export default router
