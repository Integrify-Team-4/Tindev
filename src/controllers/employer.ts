import bcrypt from 'bcrypt'
import { Request, Response, NextFunction } from 'express'
import { getRepository } from 'typeorm'

import Employer from '../entities/Employer.postgres'
import Credential from '../entities/Credential.postgres'

export const getEmployer = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const employer = await Employer.find()
    res.send(employer)
  } catch (error) {
    console.log(error)
  }
}

export const getEmployerByCompanyName = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const companyName = req.params.companyName
    const user = await Employer.getEmployerByCompanyName(companyName)
    res.send(user)
  } catch (error) {
    console.log(error)
  }
}

export const createEmployer = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { info, credential } = req.body
    const EmployerRepo = getRepository(Employer)
    credential.password = await bcrypt.hash(credential.password, 8)

    const newCredential = Credential.create({ ...credential })
    const newEmployer = Employer.create({
      ...info,
      credentials: newCredential,
    })

    await EmployerRepo.save(newEmployer)

    res.send('success')
  } catch (error) {
    console.log(error)
  }
}
