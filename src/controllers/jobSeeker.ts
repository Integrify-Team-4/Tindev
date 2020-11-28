import bcrypt from 'bcrypt'
import { Request, Response, NextFunction } from 'express'
import { getRepository } from 'typeorm'

import JobSeeker from '../entities/JobSeeker.postgres'
import Credential from '../entities/Credential.postgres'

export const getJobSeeker = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const user = await JobSeeker.find({ relations: ['credentials'] })
    res.json(user)
  } catch (error) {
    console.log(error)
  }
}

export const getJobSeekerByFirstName = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const name = req.params.name
    console.log(name)
    const user = await JobSeeker.getByFirstName(name)
    res.send(user)
  } catch (error) {
    console.log(error)
  }
}

export const createJobSeeker = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { info, credential } = req.body
    const JobSeekerRepo = getRepository(JobSeeker)
    credential.password = await bcrypt.hash(credential.password, 8)

    const newCredential = Credential.create({ ...credential })
    const newJobSeeker = JobSeeker.create({
      ...info,
      credentials: newCredential,
    })

    await JobSeekerRepo.save(newJobSeeker)

    res.send('success')
  } catch (error) {
    console.log(error)
  }
}
