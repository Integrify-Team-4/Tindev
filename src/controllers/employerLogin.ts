import { Request, Response, NextFunction } from 'express'
import passport from 'passport'

//import Employer from '../entities/Employer.postgres'

export const localLogin = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    passport.authenticate('local', function (error, employer) {
      if (error) {
        console.log(error)
      }
      if (!employer) {
        res.status(404).send('Email not found')
      }
    })
  } catch (error) {
    throw new Error('Invalid email or password')
  }
}
