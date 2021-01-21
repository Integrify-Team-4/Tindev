import express from 'express'
import { userLocalLogin, getUser } from '../controllers/login'
import tokenVerify from '../middlewares/tokenVerify'

const router = express.Router()

router.get('/user', tokenVerify, getUser)
router.post('/login/local', userLocalLogin)

export default router
