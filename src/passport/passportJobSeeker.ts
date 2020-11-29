import passportLocal from 'passport-local'
import bcrypt from 'bcrypt'

import { Request, Response, NextFunction } from 'express'

import JobSeeker from '../entities/JobSeeker.postgres'
const LocalStrategy = passportLocal.Strategy

export const findByCredentials = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { email, password } = req.body
    const matchedUser = await JobSeeker.findOne({ email })
    if (!matchedUser) throw new Error('Email not found')
    const isMatchedPassword = bcrypt.compare(password, matchedUser.password)
    if (!isMatchedPassword) throw new Error('Password didnot match')
    const matchUserData = {
      firstName: matchedUser.firstName,
      lastName: matchedUser.lastName,
      email: matchedUser.email,
      skills: matchedUser.skills,
    }
    res.send(matchUserData)
  } catch (e) {
    console.log('email or password didnnot match')
  }
}
