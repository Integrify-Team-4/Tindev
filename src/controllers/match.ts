import { Request, Response, NextFunction } from 'express'
import {
  NotFoundError,
  UnauthorizedError,
  InternalServerError,
  BadRequestError,
} from '../helpers/apiError'
import JobSeeker from '../entities/JobSeeker.postgres'
import JobPost from '../entities/JobPost.postgres'

export const match = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    // get jobseeker skills
    const jobSeeker = await JobSeeker.createQueryBuilder('jobSeeker')
      .leftJoinAndSelect('jobSeeker.skills', 'skill')
      .where('jobSeeker.id = :id')
      .getOne()
    if (!jobSeeker) {
      return next(new NotFoundError('No jobseeker found'))
    }
    // get jobpost required skills
    const jobPosts = await JobPost.createQueryBuilder('jobPost')
      .leftJoinAndSelect('jobPost.requiredSkills', 'skill')
      .where('jobPost.id = :id')
      // .andWhere('jobPost.requiredSkills like :requiredSkills', { skills: %${jobSeeker.skills}% })
      .getMany()

    // get match
    const jobPostSkills = jobPosts?.map((jp) => {
      return jp.requiredSkills
    })

    const match = jobPostSkills?.map((jps) => {
      jps.filter((s) => jobSeeker?.skills.includes(s))
    })

    if (match?.length === jobPostSkills.length) {
      return console.log('match')
    }
  } catch (error) {
    next(new InternalServerError())
  }
}
