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

//Create JobPost
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

    const savedJobPost = await JobPost.save(newJobPost)
    // console.log("savedJobPost:::1", savedJobPost)
    res.json({ message: 'Posted', savedJobPost })
  } catch (error) {
    next(new InternalServerError(error.message))
  }
}

//Update JobPost
export const updateJobPost = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const update = req.body
    const jobPostedId = req.params.id

    await getConnection()
      .createQueryBuilder()
      .update(JobPost)
      .set({
        title: update.title,
        jobDescription: update.jobDescription,
        seniority: update.seniority,
      })
      .where('id = :id', { id: `${jobPostedId}` })
      .returning('*')
      .execute()
      .then((res) => {
        return res.raw[0] // returning response.raw[0] in order to get the type back
        // return console.log("RESInUpdate:::", res.raw[0])
      })

    res.status(200).json({ message: 'Updated' })
  } catch (error) {
    return next(new InternalServerError(error.message))
  }
}
