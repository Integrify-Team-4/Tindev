import express from 'express'
import { uploadImages } from '../controllers/uploader'

const router = express.Router()

router.post('/upload/image', uploadImages)

export default router
