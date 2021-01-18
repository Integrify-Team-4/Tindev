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
import Employer from '../entities/Employer.postgres'

// Auth Controllers for job seeker
export const userLocalLogin = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  passport.authenticate('local', (error, user: JobSeeker | Employer, info) => {
    if (error) {
      return next(new InternalServerError())
    }
    if (!user) {
      if (info.message === 'Invalid email or password') {
        return next(new UnauthorizedError(info.message))
      }
      return next(new NotFoundError(info.message))
    }
    const id = user.id
    const token = jwt.sign(
      { id: id, role: user.role },
      process.env.JWT_SECRET as string
    )

    const userSerialize = { ...user, token }
    res.deliver(200, 'Success', userSerialize)
  })(req, res, next)
}

export const tokenValidate = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const user = req.user
  res.deliver(200, 'Success', user)
}
