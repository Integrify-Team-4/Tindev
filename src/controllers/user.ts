import { getConnection } from 'typeorm'
import { Request, Response, NextFunction } from 'express'

import JobSeeker from '../entities/JobSeeker.postgres'

export const getUser = async (
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

export const getUserByName = async (
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

// export const createUser = async (
//   req: Request,
//   res: Response,
//   next: NextFunction
// ) => {
//   try {
//     const user = { ...req.body } as User
//     await User.create(user).save()

//     res.send('success')
//   } catch (error) {
//     console.log(error)
//   }
// }
