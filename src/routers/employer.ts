import express from 'express'

import { localLogin, registerEmployer } from '../controllers/employer'

const router = express.Router()

router.post('/login/local', localLogin)
router.post('/create', registerEmployer)

export default router
