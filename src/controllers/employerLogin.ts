import { Request, Response, NextFunction } from 'express'
import passport from 'passport'

import { NotFoundError, UnauthorizedError } from '../helpers/apiError'
//import Employer from '../entities/Employer.postgres'

export const localLogin = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    await passport.authenticate('local', function (error, employer) {
      if (!employer) {
        next(new NotFoundError('Email or password not found', error))
      }
    })
  } catch (error) {
    next(new UnauthorizedError('Invalid email or password', error))
  }
}
