import { Request, Response, NextFunction } from 'express'

import JobSeeker from '../entities/JobSeeker.postgres'

export const getJobSeeker = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const user = await JobSeeker.find()
    res.send(user)
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
    const user = { ...req.body } as JobSeeker
    await JobSeeker.create(user).save()

    res.send('success')
  } catch (error) {
    console.log(error)
  }
}
