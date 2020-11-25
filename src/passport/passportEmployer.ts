import passportLocal from 'passport-local'
import bcrypt from 'bcrypt'

import Employer from '../entities/Employer.postgres'

const LocalStrategy = passportLocal.Strategy

export const local = new LocalStrategy(
  {
    usernameField: 'email',
    passwordField: 'password',
  },
  async (email: string, password: string, done: any) => {
    try {
      const employer = await Employer.findOne({ email })

      if (!employer) {
        return done(null, false, { message: `Email ${email} not found` })
      }
      const isMatch = await bcrypt.compare(password, employer.password)
      if (!isMatch) {
        return done(null, false, { message: 'Invalid email or password' })
      }
      return done(null, employer)
    } catch (error) {
      console.log('error', error)
    }
  }
)
