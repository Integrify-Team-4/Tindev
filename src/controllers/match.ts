import { Request, Response, NextFunction } from 'express'
import {
  NotFoundError,
  UnauthorizedError,
  InternalServerError,
  BadRequestError,
} from '../helpers/apiError'
import JobSeeker from '../entities/JobSeeker.postgres'
import Skill from '../entities/Skill.postgres'
import JobPost from '../entities/JobPost.postgres'
import { createQueryBuilder } from 'typeorm'

export const match = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const id = req.params.id
    const jobSeeker = await createQueryBuilder('jobSeeker')
      .leftJoinAndSelect('jobSeeker.Skills', 'skills')
      .where('jobSeeker.id = :id', { id: id })
      .getMany()
    if (!jobSeeker) {
      return next(new NotFoundError('No jobseeker found'))
    }
    const jobSeekerSkills = jobSeeker.Skills
    const jobPost = await JobPost.find({ relations: ['requiredSkills'] })
    const requiredSkills = jobPost.requiredSkills
    const optionalSkills = await JobPost.find({ relations: ['optionalSkills'] })
    const matchingSkills = requiredSkills.filter((skill: any) =>
      jobSeekerSkills.includes(skill)
    )
    const matchingOptionalSkills = optionalSkills.filter((skill) =>
      jobSeekerSkills.includes(skill)
    )

    if (matchingSkills.length === requiredSkills.length) {
      console.log('good match')
    }
    if (
      matchingSkills.length >= requiredSkills.length - 1 &&
      matchingOptionalSkills.length > 0
    ) {
      console.log('nice match')
    }
  } catch (error) {
    console.log(error)
  }
}
