import { Request, Response, NextFunction } from 'express'
const _ = require('lodash')

import JobSeeker from '../entities/JobSeeker.postgres'
import JobPost from '../entities/JobPost.postgres'

export const match = async (
  jobSeekerId: number,
  jobPosts: any,
) => {
  try {
    //get jobseeker skills
    const jobSeekerWithSkills = await JobSeeker.createQueryBuilder('jobSeeker')
      .leftJoinAndSelect('jobSeeker.skills', 'skill')
      .where('jobSeeker.id = :id', { id: jobSeekerId })
      .getOne()
      console.log('match-js-id', jobSeekerId)
      console.log('jobSeekerWithSkills', jobSeekerWithSkills) // skills array is empty TODO: Fix
    if (!jobSeekerWithSkills) {
      throw new Error('Jobseeker not found')
    }
  
    //get jobpost required skills TODO: Fix this
    const jobPostsWithRequiredSkills = await JobPost.createQueryBuilder('jobPost')
      .leftJoinAndSelect('jobPost.requiredSkills', 'skill')
      .where('jobPost.id = :id', { id: jobPosts.map((j: any) => j.id) })
      //.andWhere('jobPost.requiredSkills like :requiredSkills', { skills: %${jobSeeker.skills}% })
      .getMany()
      console.log('jobPostsWithRequiredSkills', jobPostsWithRequiredSkills)

      if (jobPosts.length === 0) 
        throw new Error('Jobposts not found')
      if (!jobSeekerId) {
        throw new Error('Jobseeker not found')
      }

    const newJobSeeker = await JobSeeker.findOne({
      where: { id: jobSeekerId }
    })

    //get match
    const matchingSkills = _
      .chain(jobPosts)
      .groupBy(newJobSeeker)
      .map((jobPost: any, jobSeeker: any) => ({ 
        jobSeeker: newJobSeeker, 
        skills: _.filter(jobPost, jobPostsWithRequiredSkills) 
        .includes(jobSeeker, jobSeekerWithSkills)
      }))
    
    return (console.log('matching skills', matchingSkills))
  } catch (error) {
    console.log('Internal server error', error)
  }
}

