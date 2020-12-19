import {
  Entity,
  Column,
  BaseEntity,
  PrimaryGeneratedColumn,
  ManyToMany,
} from 'typeorm'

import JobSeeker from './JobSeeker.postgres'
import JobPost from './JobPost.postgres'

@Entity()
export default class Skill extends BaseEntity {
  @PrimaryGeneratedColumn()
  id!: number

  @Column()
  name!: string

  @ManyToMany(() => JobPost, (jobPost) => jobPost.skills)
  jobPosts!: JobPost[]

  @ManyToMany(() => JobSeeker, (jobSeeker) => jobSeeker.skills)
  jobSeekers!: JobSeeker[]
}
