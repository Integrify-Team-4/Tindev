// const jwt = require('json-web-token')

// exports.verify = function(req, res, next){
//     let accessToken = req.cookies.jwt

//     if(!accessToken){
//         return res.status(403).send()
//     }
// }

import { NextFunction, request, response } from 'express'
import passport from 'passport'
import { InternalServerError, UnauthorizedError } from '../helpers/apiError'
const authjwt = async (req: Request, res: Response, next: NextFunction) => {
  passport.authenticate('jwt', function (error, user) {
    if (error) {
      return next(new InternalServerError())
    }
    if (!user) {
      return next(
        new UnauthorizedError('Invalid User credentionals, Try again')
      )
    }
    req.user = user
    return next()
  })(req, res, next)
}
export default authjwt
