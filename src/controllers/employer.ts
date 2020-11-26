import { createConnection } from 'typeorm'
import { Request, Response, NextFunction } from 'express'
import bcrypt from 'bcrypt'

import Employer from '../entities/Employer.postgres'
import { BadRequestError } from '../helpers/apiError'

// Register Employer
export const registerEmployer = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { companyName, email, password, companyInfo, address } = req.body

    const exists = Employer.find(email)
    console.log('Exists::>', exists)
    if (exists) {
      next(new BadRequestError(`Provided eMail ${email} already exists`))
    }

    const hashedPassword = await bcrypt.hash(password, 8)

    const employer = new Employer()
    employer.companyName = companyName
    employer.email = email
    employer.password = hashedPassword
    employer.companyInfo = companyInfo
    employer.address = address

    await employer.save()

    // const getEmployer = await Employer.find()
  } catch (error) {
    next(new BadRequestError())
  }
}
