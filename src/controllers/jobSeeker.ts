import bcrypt from 'bcrypt'
import { Request, Response, NextFunction } from 'express'

import JobSeeker from '../entities/JobSeeker.postgres'
import Credential from '../entities/Credential.postgres'

import {
  NotFoundError,
  UnauthorizedError,
  InternalServerError,
  BadRequestError,
} from '../helpers/apiError'

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

export const createJobSeeker = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { info, credential } = req.body
    // console.log("req.body.info:::", info)
    // console.log("req.body.credential:::", credential)
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

    res.send('success')
  } catch (error) {
    next(new InternalServerError(error.message))
  }
}
