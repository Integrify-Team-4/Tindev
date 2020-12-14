import passport from 'passport'
import { Request, Response, NextFunction } from 'express'

import { InternalServerError, UnauthorizedError } from '../helpers/apiError'

const tokenVerify = async (req: Request, res: Response, next: NextFunction) => {
  passport.authenticate('jwt', function (error, user) {
    if (error) {
      return next(new InternalServerError())
    }
    if (!user) {
      return next(new UnauthorizedError('Invalid token, Please login again'))
    }

    req.user = user
    // console.log("REQ in verifyToken", req.user)

    return next()
  })(req, res, next)
}

export default tokenVerify
