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
    default: 'employer',
  })
  role!: string

  @OneToMany(() => JobPost, (jobPost) => jobPost.employer, {
    cascade: ['remove'],
  })
  jobPosts!: JobPost[]
}
