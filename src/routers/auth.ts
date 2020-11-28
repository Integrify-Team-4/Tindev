import express from 'express'

import { localLogin } from '../controllers/employer'

const router = express.Router()

router.post('/login/local', localLogin)

export default router
