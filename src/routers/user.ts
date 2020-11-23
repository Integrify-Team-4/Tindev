import express from 'express'

import { getUser, createUser, getUserByName } from '../controllers/user'

const router = express.Router()

router.get('/', getUser)
router.get('/:name', getUserByName)
router.post('/create', createUser)

export default router
