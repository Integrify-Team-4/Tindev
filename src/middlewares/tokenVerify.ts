import passport from 'passport'
import { Request, Response, NextFunction } from 'express'

import { InternalServerError, UnauthorizedError } from '../helpers/apiError'

export const tokenVerify = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  passport.authenticate('jwt', function (error, user) {
    if (error) {
      return next(new InternalServerError())
    }
    console.log('user is from token verify ', user)
    if (!user) {
      return next(new UnauthorizedError('Invalid token, Please login again'))
    }
    req.user = user
    return next()
  })(req, res, next)
}

export default tokenVerify
