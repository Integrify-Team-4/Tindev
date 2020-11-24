import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  BaseEntity,
  JoinColumn,
  OneToOne,
  OneToMany,
} from 'typeorm'

import JobPost from './JobPost.postgres'

@Entity()
export default class Employer extends BaseEntity {
  @PrimaryGeneratedColumn()
  id!: number

  @Column()
  companyName!: string

  @Column()
  companyInfo!: string

  @Column()
  address!: string

  @Column({
    name: 'role',
    default: 'employer',
  })
  @OneToMany(() => JobPost, (jobPost) => jobPost.employer)
  jobPosts!: JobPost[]
}
