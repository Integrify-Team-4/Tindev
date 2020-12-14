import { Request, Response, NextFunction } from 'express'

import { NotFoundError, InternalServerError } from '../helpers/apiError'
import Skill from '../entities/Skill.postgres'

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
    res.status(200).json({ message: 'Skill created successfully' })
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
    next(new NotFoundError(error.message))
  }
}
