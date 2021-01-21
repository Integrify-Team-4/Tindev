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

export const createJobSeeker = async (
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
    const newJobSeeker = JobSeeker.create({
      ...info,
      credentials: newCredential,
    })

    await JobSeeker.save(newJobSeeker)

    res.deliver(201, 'Success')
  } catch (error) {
    next(new InternalServerError(error.message))
  }
}

export const updateJobSeeker = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const update = req.body
    const jobSeeker = req.user as JobSeeker

    if (!jobSeeker) {
      return next(new NotFoundError('Account not found'))
    }
    if (update.firstName) {
      jobSeeker.firstName = update.firstName
    }
    if (update.lastName) {
      jobSeeker.lastName = update.lastName
    }
    if (update.contact) {
      jobSeeker.contact = update.contact
    }
    if (update.relocate) {
      jobSeeker.relocate = update.relocate
    }
    if (update.seniority) {
      jobSeeker.seniority = update.seniority
    }
    if (update.startingDate) {
      jobSeeker.startingDate = update.startingDate
    }
    if (update.skills) {
      jobSeeker.skills = update.skills
    }

    const updated = await JobSeeker.save(jobSeeker)
    res.deliver(200, 'Updated', updated)
  } catch (error) {
    next(new InternalServerError())
  }
}
