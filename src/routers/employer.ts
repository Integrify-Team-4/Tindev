import express from 'express'

import {
  getEmployer,
  createEmployer,
  getEmployerByCompanyName,
} from '../controllers/employer'

const router = express.Router()

router.get('/', getEmployer)
router.get('/:companyName', getEmployerByCompanyName)
router.post('/create', createEmployer)
