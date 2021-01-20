import passportLocal from 'passport-local'
import bcrypt from 'bcrypt'
import passportJWT, { ExtractJwt } from 'passport-jwt'

import Credential from '../entities/Credential.postgres'
import JobSeeker from '../entities/JobSeeker.postgres'
import Employer from '../entities/Employer.postgres'

const LocalStrategy = passportLocal.Strategy
const JWTStrategy = passportJWT.Strategy

export const local = new LocalStrategy(
  {
    usernameField: 'email',
    passwordField: 'password',
  },
  async (email: string, password: string, done: any) => {
    try {
      const credential = await Credential.findOne({
        where: { email: email },
        relations: ['employer', 'jobSeeker'],
      })

      if (!credential) {
        return done(null, false, { message: `Email ${email} not found` })
      }

      const isMatch = await bcrypt.compare(password, credential.password)

      if (!isMatch) {
        return done(null, false, { message: 'Invalid email or password' })
      }

      return done(null, credential.employer || credential.jobSeeker)
    } catch (error) {
      console.log('error', error)
    }
  }
)

export const jwt = new JWTStrategy(
  {
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: process.env.JWT_SECRET,
  },
  async (jwtPayload, done) => {
    const { id, role } = jwtPayload

    if (role === 'job seeker') {
      const jobSeeker = await JobSeeker.findOne(id)
      if (jobSeeker) {
        return done(null, jobSeeker)
      }
      return done(null, false)
    }
    if (role === 'employer') {
      const employer = await Employer.findOne(id, { relations: ['jobPosts'] })
      if (employer) {
        return done(null, employer)
      }
      return done(null, false)
    }
  }
)
