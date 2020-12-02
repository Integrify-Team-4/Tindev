import express from 'express'

import { creatingSkills, getSkills } from './../controllers/skills'

const router = express.Router()

router.get('/', getSkills)
router.post('/create', creatingSkills)

export default router
