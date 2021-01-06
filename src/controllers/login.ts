import { Request, Response, NextFunction } from 'express'
import passport from 'passport'
import jwt from 'jsonwebtoken'
import {
  NotFoundError,
  UnauthorizedError,
  InternalServerError,
  BadRequestError,
} from '../helpers/apiError'
import JobSeeker from '../entities/JobSeeker.postgres'

// Auth Controllers for job seeker
export const jobSeekerLocalLogin = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  passport.authenticate('local', (error, jobSeeker: JobSeeker, info) => {
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
    const token = jwt.sign(
      { id: id, role: jobSeeker.role },
      process.env.JWT_SECRET as string
    )

    const userSerialize = { ...jobSeeker, token }
    res.deliver(200, 'Success', userSerialize)
  })(req, res, next)
}
