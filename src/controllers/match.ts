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
    const jobSeeker = await createQueryBuilder('jobSeeker')
      .leftJoinAndSelect('jobSeeker.skills', 'skill')
      .where('jobSeeker.id = :id')
      .getMany()
    if (!jobSeeker) {
      return next(new NotFoundError('No jobseeker found'))
    }
    const jobSeekerSkills = jobSeeker.skills
    const jobPost = await JobPost.find({
      relations: ['requiredSkills', 'optionalSkills'],
    })
    res.json(jobPost)
    const requiredSkills = jobPost.requiredSkills
    const optionalSkills = jobPost.optionalSkills
    const matchingSkills = requiredSkills.filter((skill: any) =>
      jobSeekerSkills.toLowerCase().includes(skill.toLowerCase())
    )
    const matchingOptionalSkills = optionalSkills.filter((skill: any) =>
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
