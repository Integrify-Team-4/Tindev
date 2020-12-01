import { Request, Response, NextFunction } from 'express'
import Skill from '../../src/entities/Skill.postgres'

import {
  NotFoundError,
  UnauthorizedError,
  InternalServerError,
  BadRequestError,
} from '../helpers/apiError'

// posting skills to database
export const creatingSkills = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const name = req.body
    const skill = Skill.create({ ...name })
    await Skill.save(skill)
    await res.status(200).json({ message: 'success to create skills' })
  } catch (error) {
    next(new InternalServerError(error.message))
  }
}

// getting all skills from database
export const getSkills = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const skills = await Skill.find()
    res.status(200).json({ skills })
  } catch (error) {
    next(new InternalServerError(error.message))
  }
}
