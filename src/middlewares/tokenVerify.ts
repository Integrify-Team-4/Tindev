import passport from 'passport'
import { Request, Response, NextFunction } from 'express'

import { InternalServerError, UnauthorizedError } from '../helpers/apiError'

const tokenVerify = async (req: Request, res: Response, next: NextFunction) => {
  passport.authenticate('jwt', function (error, user) {
    if (error) {
      return next(new InternalServerError())
    }
    console.log('user is from token verify ', user)
    if (!user) {
      return next(new UnauthorizedError('Invalid token, Please login again'))
    }
    next()
    req.user = user
    console.log(req.user, 'it is from token verify')
    return req.user
    //return next()
  })(req, res, next)
}

export default tokenVerify
