import { Request, Response, NextFunction } from 'express'
import passport from 'passport'

import { NotFoundError, UnauthorizedError } from '../helpers/apiError'

export const localLogin = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  passport.authenticate('local', function (error, employer) {
    if (!employer) {
      return next(new NotFoundError('Email or password not found', error))
    }
    res.status(200).send({
      usernameField: employer.email,
      passwordField: employer.password,
    })
  })(req, res, next)
}
