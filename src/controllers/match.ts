import { Request, Response, NextFunction } from 'express'
import _ from 'lodash'
import { NotFoundError, InternalServerError } from '../helpers/apiError'
import JobSeeker from '../entities/JobSeeker.postgres'
import JobPost from '../entities/JobPost.postgres'
import Skill from '../entities/Skill.postgres'
import Employer from '../entities/Employer.postgres'

type CountResult = {
  [id: string]: { count: number; result: JobPost | JobSeeker }
}

export const jobseekerMatch = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const jobSeeker = req.user as JobSeeker
    if (!jobSeeker) return next(new NotFoundError('User not found'))

    const seekerSkillIds = jobSeeker.skills.map((skill) => skill.id)

    const posts = (await Promise.all(
      seekerSkillIds.map(async (id) => {
        try {
          const skill = (await Skill.findOne(id, {
            relations: ['jobPosts'],
          })) as Skill

          if (skill.jobPosts.length === 0) return
          return skill.jobPosts
        } catch (error) {
          next(new InternalServerError())
        }
      })
    )) as JobPost[][]

    //**Flaten the array of job posts: [[...jobPosts], [...jobPosts]] to [...jobPosts] */
    const matchedPosts = _.flatten(posts)
    if (matchedPosts.length === 0)
      return next(new NotFoundError('No match found'))

    //**Count the times that a post come up and store it in a object*/
    //**The count is equivalent to how many skills is matched */
    const matchCount = matchedPosts.reduce(
      (acc: CountResult, next: JobPost) => {
        if (next.id in acc) {
          acc[next.id].count++
          return acc
        }
        acc[next.id] = {
          count: 1,
          result: next,
        }
        return acc
      },
      {}
    )

    //**Filter posts to those that has count >= 3 */
    const filterPost: JobPost[] = []

    for (const id in matchCount) {
      if (matchCount[id].count >= 3) {
        filterPost.push(matchCount[id].result as JobPost)
      }
    }

    res.deliver(200, 'success', filterPost)
  } catch (error) {
    next(new InternalServerError())
  }
}

export const employerMatch = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const employer = req.user as Employer
    const postId = req.params.postId
    if (!employer) return next(new NotFoundError('User not found'))

    const post = await JobPost.findOne(postId)
    if (!post) return next(new NotFoundError('Job Post not found'))
    const skillsInPost = post.skills.map((skill) => skill.id)

    const jobseeker = (await Promise.all(
      skillsInPost.map(async (id) => {
        try {
          const skill = (await Skill.findOne(id, {
            relations: ['jobSeekers'],
          })) as Skill

          if (skill.jobSeekers.length === 0) return
          return skill.jobSeekers
        } catch (error) {
          next(new InternalServerError())
        }
      })
    )) as JobSeeker[][]

    //**Flaten the array of jobseekers
    const matchedJobseekers = _.flatten(jobseeker)
    if (matchedJobseekers.length === 0)
      return next(new NotFoundError('No match found'))

    //**Count the times that a jobseeker come up and store it in a object*/
    //**The count is equivalent to how many skills is matched */
    const matchCount = matchedJobseekers.reduce(
      (acc: CountResult, next: JobSeeker) => {
        if (next.id in acc) {
          acc[next.id].count++
          return acc
        }
        acc[next.id] = {
          count: 1,
          result: next,
        }
        return acc
      },
      {}
    )

    //**Filter jobseeker to those that has count >= 3 */
    const filterJobseekers: JobSeeker[] = []

    for (const id in matchCount) {
      if (matchCount[id].count >= 3) {
        filterJobseekers.push(matchCount[id].result as JobSeeker)
      }
    }

    res.deliver(200, 'success', filterJobseekers)
  } catch (error) {
    next(new InternalServerError())
  }
}
