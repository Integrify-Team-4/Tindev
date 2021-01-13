import express from 'express'
import tokenVerify from '../middlewares/tokenVerify'

import {
  getJobSeeker,
  createJobSeeker,
  updateJobSeeker,
} from '../controllers/jobSeeker'
import { match } from '../controllers/match'
import { uploadImages } from './../controllers/uploader'

const router = express.Router()

router.get('/', tokenVerify, getJobSeeker)
router.post('/', createJobSeeker)
router.get('/match', tokenVerify, match)
router.patch('/', tokenVerify, updateJobSeeker)
router.post('/upload/profile', tokenVerify, uploadImages)

export default router
