import { Request, Response, NextFunction } from 'express'
const _ = require('lodash')

import JobSeeker from '../entities/JobSeeker.postgres'
import JobPost from '../entities/JobPost.postgres'

export const match = async (
  jobSeekerId: number,
  jobPosts: any,
) => {
  try {
    if (jobPosts.length === 0) {
      throw new Error('Jobposts not found')
    }
    if (!jobSeekerId) {
      throw new Error('Jobseeker not found')
    }
    //get jobseeker skills
    const jobSeekerWithSkills = await JobSeeker.createQueryBuilder('jobSeeker')
      .leftJoinAndSelect('jobSeeker.skills', 'skill')
      .where('jobSeeker.id = :id', { id: jobSeekerId })
      .getOne()
      console.log('jobSeekerWithSkills', jobSeekerWithSkills) // skills array is empty TODO: Fix
    if (!jobSeekerWithSkills) {
      throw new Error('Jobseeker not found')
    }

    const jobSeekerSkills = jobSeekerWithSkills.skills
  
    //get jobpost required skills TODO: Fix this
    const jobPostsWithSkills = await JobPost.createQueryBuilder('jobPost')
      .leftJoinAndSelect('jobPost.requiredSkills', 'skill')
      .where('jobPost.id = :id', { id: jobPosts.map((j: any) => ({ id: j.id, requiredSkills: j.requiredSkills })) })
      .andWhere('jobPost.requiredSkills like :requiredSkills', { requiredSkills: `%${jobSeekerSkills}%` })
      .getMany()
      return (console.log('jobPostsWithRequiredSkills', jobPostsWithSkills))

    //get match
    // const matchingSkills = _
    //   .chain(jobPosts)
    //   .groupBy(jobSeekerWithSkills)
    //   .map((jobPost: any, jobSeeker: any) => ({ 
    //     jobSeeker: jobSeekerWithSkills, 
    //     skills: _.filter(jobPost, jobPostsWithSkills) 
    //     .includes(jobSeeker, jobSeekerSkills)
    //   }))
    
    // return (console.log('matching skills', matchingSkills))
  } catch (error) {
    console.log('Internal server error', error)
  }
}

