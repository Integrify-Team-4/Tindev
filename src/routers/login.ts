import express from 'express'
import { userLocalLogin } from '../controllers/login'

const router = express.Router()

router.post('/login/local', userLocalLogin)

export default router
