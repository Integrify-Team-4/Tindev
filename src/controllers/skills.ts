import { Request, Response, NextFunction } from 'express'
import Skill from '../entities/Skill.postgres'

import { InternalServerError } from '../helpers/apiError'

// posting skills to database
export const creatingSkills = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const skill = req.body
    const newSkill = Skill.create({ ...skill })
    const newSKill = await Skill.save(newSkill)

    res.deliver(201, 'Success', newSKill)
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
