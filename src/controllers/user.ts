import { getConnection } from 'typeorm'
import { Request, Response, NextFunction } from 'express'

import User from '../entities/User.postgres'

export const getUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const user = await getConnection()
      .createQueryBuilder()
      .select()
      .from(User, 'user')
      .execute()

    res.send(user)
  } catch (error) {
    console.log(error)
  }
}

export const createUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    await getConnection()
      .createQueryBuilder()
      .insert()
      .into(User)
      .values({
        firstName: 'duy',
        lastName: 'nguyen',
        age: 22,
      })
      .execute()

    res.send('success')
  } catch (error) {
    console.log(error)
  }
}
