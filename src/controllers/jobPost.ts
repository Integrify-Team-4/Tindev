import { Request, Response, NextFunction } from 'express'
import { getRepository } from 'typeorm'

import JobPost from '../entities/JobPost.postgres'
import Employer from '../entities/Employer.postgres'

export const createJobPost = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { info, employer } = req.body
    const JobPostRepo = getRepository(JobPost)
    const companyName = req.params.companyName
    const postingEmployer = await employer.getEmployerByCompanyName(companyName)
    const newJobPost = JobPost.create({
      ...info,
      employer: postingEmployer,
    })
    await JobPostRepo.save(newJobPost)
  } catch (error) {
    console.log(error)
  }
}
