import { Request, Response, NextFunction } from 'express'
import bcrypt from 'bcrypt'
import passport from 'passport'

import {
  NotFoundError,
  UnauthorizedError,
  InternalServerError,
  BadRequestError,
} from '../helpers/apiError'
import JobPost from '../entities/JobPost.postgres'
import Employer from '../entities/Employer.postgres'
import Credential from '../entities/Credential.postgres'

//**Auth controllers */
export const localLogin = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  passport.authenticate('local', function (error, user: Employer, info) {
    if (error) {
      return next(new InternalServerError())
    }
    if (!user) {
      if (info.message === 'Invalid email or password') {
        return next(new UnauthorizedError(info.message))
      }
      return next(new NotFoundError(info.message))
    }
    res.deliver(200, 'Local Login Successful', user)
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
    res.deliver(200, 'Registered Successfully')
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
    const verifiedUser = req.user

    console.log('verifiedUser in getEmployers', verifiedUser)
    const users = await Employer.find({ relations: ['credentials'] })
    res.deliver(200, 'Successfully fetched employers', users)
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
    const verifiedEmployer = req.user
    console.log('user in employer', req.body)

    console.log('verifiedEmployer:::', verifiedEmployer)
    const employerId = parseInt(req.params.id)
    const update = req.body
    const employer = await Employer.findOne(employerId, {
      relations: ['credentials'],
    })

    if (!employer) {
      return next(new NotFoundError())
    }
    update.companyName && (employer.companyName = update.companyName)
    update.companyInfo && (employer.companyInfo = update.companyInfo)
    update.address && (employer.address = update.address)
    update.email && (employer.credentials.email = update.email)
    update.password && (employer.credentials.password = update.password)

    const updatedEmployer = await Employer.save(employer)
    res.deliver(200, 'Updated successfully', updatedEmployer)
  } catch (error) {
    next(new InternalServerError(error.message))
  }
}

// getting employer based on matched credentials
export const getEmployer = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const user = await Employer.find({ relations: ['credentials'] })
    res.deliver(200, 'Employer Fetched', user)
  } catch (error) {
    console.log(error)
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

    const savedJobPost = await JobPost.save(newJobPost)
    res.deliver(201, 'Posted', savedJobPost)
  } catch (error) {
    next(new InternalServerError(error.message))
  }
}

//Get JobPosts
export const getJobPosts = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const verifiedUser = req.user
    console.log('verifiedUser in getJobPosts', verifiedUser)
    const jobPosts = await JobPost.find()
    res.deliver(200, 'Successfully fetched', jobPosts)
  } catch (error) {
    return next(new NotFoundError(error.message))
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
    const jobPostedId = parseInt(req.params.id)
    const jobPost = await JobPost.findOne({ where: { id: jobPostedId } })

    if (!jobPost) {
      return next(new NotFoundError(`${jobPost} is not found`))
    }

    update.title && (jobPost.title = update.title)
    update.seniority && (jobPost.seniority = update.seniority)
    update.jobDescription && (jobPost.jobDescription = update.jobDescription)
    update.requiredSkills && (jobPost.requiredSkills = update.requiredSkills)

    await JobPost.save(jobPost)
    res.deliver(200, 'Updated')
  } catch (error) {
    return next(new InternalServerError(error.message))
  }
}

export const deleteJobPostById = async (
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
    await jobPost.remove()
    res.deliver(200, 'Success')
  } catch (error) {
    console.log(error)
  }
}
