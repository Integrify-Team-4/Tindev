const _ = require('lodash')
import { getRepository } from 'typeorm'

import JobSeeker from '../entities/JobSeeker.postgres'
import JobPost from '../entities/JobPost.postgres'

export const match = async (
  jobSeekerId: number,
  jobPosts: any,
) => {
  try {
    //get jobseeker skills
    const skills = await JobSeeker.createQueryBuilder('jobSeeker')
      .leftJoinAndSelect('jobSeeker.skills', 'skill')
      .where('jobSeeker.id = :id', { jobSeekerId })
      .getOne()
    if (!skills) {
      throw new Error('Jobseeker skills not found')
    }
  
    //get jobpost required skills
    const requiredSkills = await JobPost.createQueryBuilder('jobPost')
      .leftJoinAndSelect('jobPost.requiredSkills', 'skill')
      .where('jobPost.id = :id')
      //.andWhere('jobPost.requiredSkills like :requiredSkills', { skills: %${jobSeeker.skills}% })
      .getMany()

    // get match
    //const matching = (jobPosts: any, jobSeekerId: any) => {
      if (jobPosts.length === 0) 
        throw new Error('Jobposts not found')
      if (!jobSeekerId) {
        throw new Error('Jobseeker not found')
      }

      const newJobSeeker = await JobSeeker.findOne({
        where: { id: jobSeekerId }
      })

      const matchingSkills = _
        .chain(jobPosts)
        .groupBy(newJobSeeker)
        .map((jobPost: any, jobSeeker: any) => ({ 
          jobSeeker: newJobSeeker, 
          skills: _.filter(jobPost, requiredSkills) 
          .includes(jobSeeker, skills)
        }))
      
      console.log('matching skills', matchingSkills)
      return matchingSkills
    //}
    //return matching
  } catch (error) {
    console.log('Internal server error', error)
  }
}

