import { Request, Response, NextFunction } from 'express'
import bcrypt from 'bcrypt'
import passport from 'passport'
import jwt from 'jsonwebtoken'

import {
  NotFoundError,
  UnauthorizedError,
  InternalServerError,
  BadRequestError,
} from '../helpers/apiError'
import Employer from '../entities/Employer.postgres'
import Credential from '../entities/Credential.postgres'
import JobPost from '../entities/JobPost.postgres'

export const localLogin = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  passport.authenticate('local', function (error, employer: Employer, info) {
    if (error) {
      return next(new InternalServerError())
    }
    if (!employer) {
      if (info.message === 'Invalid email or password') {
        return next(new UnauthorizedError(info.message))
      }
      return next(new NotFoundError(info.message))
    }

    const id = employer.id
    const token = jwt.sign(
      { id: id, role: employer.role },
      process.env.JWT_SECRET as string
    )
    const userSerialize = { ...employer, token }

    res.deliver(200, 'Success', userSerialize)
  })(req, res, next)
}

export const registerEmployer = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { info, credential } = req.body
    const exists = await Credential.findOne({
      where: { email: credential.email },
    })

    if (exists) {
      return next(
        new BadRequestError(`Email ${credential.email} already exists`)
      )
    }

    credential.password = await bcrypt.hash(credential.password, 8)

    const newCredential = Credential.create({ ...credential })
    const newEmployer = Employer.create({
      ...info,
      credentials: newCredential,
    })

    await Employer.save(newEmployer)

    res.deliver(201, 'Registered')
  } catch (error) {
    next(new InternalServerError(error.message))
  }
}

export const updateEmployer = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const update = req.body
    const employer = req.user as Employer

    if (!employer) {
      return next(new NotFoundError())
    }
    if (update.companyName) {
      employer.companyName = update.companyName
    }
    if (update.companyInfo) {
      employer.companyInfo = update.companyInfo
    }
    if (update.address) {
      employer.address = update.address
    }

    const updatedEmployer = await Employer.save(employer)
    res.deliver(200, 'Updated', updatedEmployer)
  } catch (error) {
    next(new InternalServerError(error.message))
  }
}

export const getEmployer = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const employer = req.user as Employer
    res.deliver(200, 'Success', employer)
  } catch (error) {
    next(new InternalServerError())
  }
}

export const createJobPost = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const jobPost = req.body
    const employer = req.user as Employer

    if (!employer) {
      return next(new NotFoundError(`Employer ${employer} not found`))
    }

    const newJobPost = JobPost.create({
      ...jobPost,
      employer: employer,
    })

    const savedJobPost = await JobPost.save(newJobPost)
    res.deliver(201, 'Posted', savedJobPost)
  } catch (error) {
    next(new InternalServerError(error.message))
  }
}

export const updateJobPost = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const update = req.body.update // get typed in data from body.
    const employer = req.user as Employer
    const jobPostId = req.body.id

    const jobPost = await JobPost.findOne(jobPostId)

    if (!jobPost || jobPost.employer.id !== employer.id) {
      return next(
        new NotFoundError('Post is not found or you do not own this port')
      )
    }

    if (update.title) {
      jobPost.title = update.title
    }
    if (update.description) {
      jobPost.jobDescription = update.jobDescription
    }
    if (update.seniority) {
      jobPost.seniority = update.seniority
    }
    if (update.skills) {
      jobPost.skills = update.skills
    }

    const updated = await JobPost.save(jobPost)
    res.deliver(200, 'Updated', updated)
  } catch (error) {
    return next(new InternalServerError(error.message))
  }
}

export const deleteJobPostbyId = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const jobPostId = parseInt(req.params.id)
    const employer = req.user as Employer
    const jobPost = await JobPost.findOne(jobPostId)

    if (!jobPost || jobPost.employer.id !== employer.id) {
      return next(
        new NotFoundError('Post is not found or you do not own this port')
      )
    }

    await jobPost.remove()
    res.deliver(200, 'Removed')
  } catch (error) {
    next(new InternalServerError())
  }
}
