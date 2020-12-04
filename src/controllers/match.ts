import { Request, Response, NextFunction } from 'express'
const _ = require('lodash')

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
      .innerJoinAndSelect('jobPost.requiredSkills', 'skill')
      .where('jobPost.id = :id')
      //.andWhere('jobPost.requiredSkills like :requiredSkills', { skills: %${jobSeeker.skills}% })
      .getMany()

    // get match
    const matching = (jobPosts: any) => {
      if (jobPosts.length === 0) 
        return next(new NotFoundError)

      const mostSkills = _
        .chain(jobPosts)
        .groupBy('jobSeeker')
        .map((jobPost: any, jobSeeker: any) => ({ jobSeeker: jobSeeker, requiredSkills: _.sumBy(jobPost, 'requiredSkills') }))
        .sortBy('requiredSkills')
        .last()
        .value()
        return mostSkills
    }
  } catch (error) {
  next(new InternalServerError)
  }
}

