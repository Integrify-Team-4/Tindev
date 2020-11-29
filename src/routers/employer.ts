import express from 'express'

import { registerEmployer, updateEmployer } from '../controllers/employer'

const router = express.Router()

router.post('/create-employer', registerEmployer)
router.put('/:employerId', updateEmployer)

export default router
