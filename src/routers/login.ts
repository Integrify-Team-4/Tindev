import express from 'express'
import { userLocalLogin, tokenValidate } from '../controllers/login'
import tokenVerify from '../middlewares/tokenVerify'

const router = express.Router()

router.get('token/validate', tokenVerify, tokenValidate)
router.post('/login/local', userLocalLogin)

export default router
