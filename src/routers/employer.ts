import express from 'express'

import {
  localLogin,
  registerEmployer,
  createJobPost,
<<<<<<< HEAD
  deleteJobPostbyId,
=======
>>>>>>> e67fb9412a718dd26857533426dbc2464e397d23
} from '../controllers/employer'

const router = express.Router()

router.post('/login/local', localLogin)
router.post('/create', registerEmployer)
router.post('/jobs/:companyName', createJobPost)
<<<<<<< HEAD

// deleting job post by id
router.delete('/jobs/:id', deleteJobPostbyId)
=======
>>>>>>> e67fb9412a718dd26857533426dbc2464e397d23

export default router
