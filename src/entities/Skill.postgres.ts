import {
  ManyToOne,
  Entity,
  Column,
  BaseEntity,
  PrimaryGeneratedColumn,
} from 'typeorm'

import JobSeeker from './JobSeeker.postgres'
import JobPost from './JobPost.postgres'

@Entity()
export default class Role extends BaseEntity {
  @PrimaryGeneratedColumn()
  id!: number

  @Column()
  name!: string

  @ManyToOne(() => JobSeeker, (jobSeeker) => jobSeeker.skills)
  jobSeeker!: JobSeeker

  @ManyToOne(() => JobPost, (jobPost) => jobPost.requiredSkills)
  jobPost!: JobSeeker
}
