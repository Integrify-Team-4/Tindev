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
import JobSeeker from '../entities/JobSeeker.postgres'
import Credential from '../entities/Credential.postgres'
import { getConnection, UpdateDateColumn } from 'typeorm'

// Auth Controllers for job seeker
export const jobSeekerLocalLogin = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  passport.authenticate('local', (error, jobSeeker, info) => {
    if (error) {
      return next(new InternalServerError())
    }
    if (!jobSeeker) {
      if (info.message === 'Invalid email or password') {
        return next(new UnauthorizedError(info.message))
      }
      return next(new NotFoundError(info.message))
    }
    const id = jobSeeker.id
    console.log('hello id', id)

    const token = jwt.sign({ id: id }, process.env.JWT_SECRET as string)
    console.log(token)
    const userSerialize = { ...jobSeeker, token }
    res.status(200).send(userSerialize)
  })(req, res, next)
}

// Register Job Seeker and match with job posts
export const createJobSeeker = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { info, credential } = req.body
    const jobSeeker = req.body
    const exists = await Credential.findOne({
      where: { email: credential.email },
    })

    if (exists) {
      next(new BadRequestError(`Email ${credential.email} already exists`))
    }
    credential.password = await bcrypt.hash(credential.password, 8)
    const newCredential = Credential.create({ ...credential })
    const newJobSeeker = JobSeeker.create({
      ...info,
      credentials: newCredential,
    })

    await JobSeeker.save(newJobSeeker)

    const jobSeekerId = parseInt(req.params.id)
    await JobSeeker.findOne(jobSeekerId)
    await JobSeeker.match(jobSeeker)

    res.send('success')
  } catch (error) {
    next(new InternalServerError(error.message))
  }
}

// getting jobSeeker based on matched credentials
export const getJobSeeker = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const user = await JobSeeker.find({ relations: ['credentials'] })
    res.json(user)
  } catch (error) {
    console.log(error)
  }
}

// JobSeek update

export const updateJobSeeker = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const update = req.body
    console.log('update get body request', update)
    const jobSeekerId = parseInt(req.params.id)
    console.log('Jobseeker ID ', jobSeekerId)
    const jobSeeker = await JobSeeker.findOne({ where: { id: jobSeekerId } })
    if (!jobSeeker) {
      next(new NotFoundError(`${jobSeeker} not found`))
    }
    if (update.firstName) {
      jobSeeker!.firstName = update.firstName
    }
    if (update.lastName) {
      jobSeeker!.lastName = update.lastName
    }
    if (update.contact) {
      jobSeeker!.contact = update.contact
    }
    if (update.relocate) {
      jobSeeker!.relocate = update.relocate
    }
    if (update.seniority) {
      jobSeeker!.seniority = update.seniority
    }
    if (update.startingDate) {
      jobSeeker!.startingDate = update.startingDate
    }

    await JobSeeker.update(jobSeekerId, update)
    res.status(200).json({ message: 'JobSeeker Updated' })
  } catch (error) {
    next(new NotFoundError('ID NOT FIND'))
  }
}
