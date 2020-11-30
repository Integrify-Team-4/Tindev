import passportLocal from 'passport-local'
import bcrypt from 'bcrypt'

import Credential from '../entities/Credential.postgres'

const LocalStrategy = passportLocal.Strategy

export const local = new LocalStrategy(
  {
    usernameField: 'email',
    passwordField: 'password',
  },
  async (email: string, password: string, done: any) => {
    try {
      const credential = await Credential.findOne({
        where: { email: email },
        relations: ['employer'],
      })

      if (!credential) {
        return done(null, false, { message: `Email ${email} not found` })
      }

      const isMatch = await bcrypt.compare(password, credential.password)

      if (!isMatch) {
        return done(null, false, { message: 'Invalid email or password' })
      }

      return done(null, credential.employer)
    } catch (error) {
      console.log('error', error)
    }
  }
)
