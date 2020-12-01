import express from 'express'

import { creatingSkills } from './../controllers/skills'

const router = express.Router()

router.post('/create', creatingSkills)

export default router
