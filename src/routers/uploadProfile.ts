import express from 'express'
import { uploadImages } from '../controllers/uploader'
import tokenVerify from '../middlewares/tokenVerify'

const router = express.Router()

router.post('/image', uploadImages)

export default router
