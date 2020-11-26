import express from 'express'

import { registerEmployer } from '../controllers/employer'

const router = express.Router()

router.post('/create-employer', registerEmployer)

export default router
