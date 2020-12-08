import passportLocal from 'passport-local'
import bcrypt from 'bcrypt'
import passportJWT, { ExtractJwt } from 'passport-jwt'

import Credential from '../entities/Credential.postgres'

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
    const { id } = jwtPayload
    const user = await Credential.findOne(id, {
      relations: ['jobSeeker', 'employer'],
    })
    if (!user) return done(null, false)
    return done(null, user)
  }
)
