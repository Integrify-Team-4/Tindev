import { Request, Response, NextFunction } from 'express'

import {
  NotFoundError,
  UnauthorizedError,
  InternalServerError,
  BadRequestError,
} from '../helpers/apiError'
import JobSeeker from '../entities/JobSeeker.postgres'
import JobPost from '../entities/JobPost.postgres'
import Skill from '../entities/Skill.postgres'

export const match = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const id = req.params.id
    const jobSeeker = await JobSeeker.findOne(id, { relations: ['skills'] })

    if (!jobSeeker) return next(new NotFoundError('User not found'))
  
    const seekerSkillIds = jobSeeker.skills.map((skill) => skill.id)

    const posts = await Promise.all(
      seekerSkillIds.map(async (id) => {
        const skill = (await Skill.findOne(id, {
          relations: ['jobPosts'],
        })) as Skill
        
        return skill.jobPosts
      })
    )

    // const jobPosts = await JobPost.find()

    // const matched = await Promise.all(
    //   jobPosts.map(jobPost => {
    //     return seekerSkillIds.map(id => {
    //       if (jobPost.requiredSkills.map(rs => rs.id === id)) {
    //       return jobPost
    //       }
    //     })
    //   })
    // )

    // console.log(matched)

    type Acc = {
      [id: string]: number
    }

    //**Flaten the array of job posts: [[...jobPosts], [...jobPosts]] */
    const matchedPosts = posts.flat()

    console.log('matchedPosts', matchedPosts)

    //**Count the times that a post id come up and store it in a object */
    const count = matchedPosts.reduce((acc: Acc, next: JobPost) => {
      if (acc[next.id]) {
        acc[next.id]++
          return acc
      }
      acc[next.id] = 1
      return acc
    }, {})

    console.log('count', count)

    //**Sort the id of posts based on its count */
    const result = Object.keys(count).sort((a, b) => {
      if (count[a] < count[b]) return 1
      return -1
    })

    console.log(result)

    //**Take the first three ids */
    const finalResult = result.slice(0, 3)

    //**Query for the employers that own the post ids */
    const matchedEmployers = await Promise.all(
      finalResult.map(async (id) => {
        const employer = ((await JobPost.findOne(id, {
          relations: ['employer'],
        })) as JobPost).employer
        return employer
      })
    )

    res.deliver(200, 'success', matchedEmployers)
  } catch (error) {
    next(new InternalServerError())
  }
}
