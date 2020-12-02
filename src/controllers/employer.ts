import { getConnection } from 'typeorm'
import { Request, Response, NextFunction } from 'express'
import bcrypt from 'bcrypt'
import passport from 'passport'
import {
  NotFoundError,
  UnauthorizedError,
  InternalServerError,
  BadRequestError,
} from '../helpers/apiError'
import Employer from '../entities/Employer.postgres'
import Credential from '../entities/Credential.postgres'
import JobPost from '../entities/JobPost.postgres'

//**Auth controllers */
export const localLogin = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  passport.authenticate('local', function (error, user, info) {
    if (error) {
      return next(new InternalServerError())
    }
    if (!user) {
      if (info.message === 'Invalid email or password') {
        return next(new UnauthorizedError(info.message))
      }
      return next(new NotFoundError(info.message))
    }

    res.status(200).send(user)
  })(req, res, next)
}

//**Register Employer*/
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
      next(new BadRequestError(`Email ${credential.email} already exists`))
    }

    credential.password = await bcrypt.hash(credential.password, 8)

    const newCredential = Credential.create({ ...credential })
    const newEmployer = Employer.create({
      ...info,
      credentials: newCredential,
    })

    await Employer.save(newEmployer)

    res.status(200).json({ message: 'Registered Successfully' })
  } catch (error) {
    next(new InternalServerError(error.message))
  }
}

//**Get all employers*/
export const getEmployers = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const users = await Employer.find({ relations: ['credentials'] })
    res.status(200).json({ message: 'Successfully fetched employers', users })
  } catch (error) {
    next(new NotFoundError('Employer not found'))
  }
}

//**Update employer*/
export const updateEmployer = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const employerId = parseInt(req.params.id)
    const update = req.body
    const employer = await Employer.findOne(employerId, {
      relations: ['credentials'],
    })

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
    if (update.email) {
      employer.credentials.email = update.email
    }
    if (update.password) {
      employer.credentials.password = update.password
    }
    const updatedEmployer = await Employer.save(employer)
    res.json({ message: 'Updated successfully', data: updatedEmployer })
  } catch (error) {
    next(new InternalServerError(error.message))
  }
}

export const createJobPost = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const jobPost = req.body
    const companyName = req.params.companyName
    const postingEmployer = await Employer.getEmployerByCompanyName(companyName)

    if (!postingEmployer) {
      return next(new NotFoundError(`Employer ${companyName} not found`))
    }

    const newJobPost = JobPost.create({
      ...jobPost,
      employer: postingEmployer,
    })

    await JobPost.save(newJobPost)

    res.json({ message: 'Posted' })
  } catch (error) {
    next(new InternalServerError(error.message))
  }
}

export const deleteJobPostbyId = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const id = parseInt(req.params.id)
    const jobPost = await JobPost.findOne(id)
    if (!jobPost) {
      return next(new NotFoundError('Job is no more available'))
    }
    await jobPost?.remove()
    res.json({ message: 'success' })
  } catch (error) {
    console.log(error)
  }
}
