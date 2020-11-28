import { Request, Response, NextFunction } from 'express'
import passport from 'passport'

import {
  NotFoundError,
  UnauthorizedError,
  InternalServerError,
} from '../helpers/apiError'

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

    res.send(user)
  })(req, res, next)
}
