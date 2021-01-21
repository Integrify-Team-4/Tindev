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
import Credential from './Credential.postgres'

@Entity()
export default class Employer extends BaseEntity {
  @PrimaryGeneratedColumn()
  id!: number

  @Column({ unique: true, nullable: true })
  companyName!: string

  @Column({ nullable: true })
  companyInfo!: string

  @Column({ nullable: true })
  address!: string

  @Column({
    default: 'employer',
  })
  role!: string

  @Column({ nullable: true })
  image!: string

  @OneToOne(() => Credential, (credential) => credential.employer, {
    cascade: true,
  })
  @JoinColumn()
  credentials!: Credential

  @OneToMany(() => JobPost, (jobPost) => jobPost.employer, {
    cascade: ['remove'],
  })
  jobPosts!: JobPost[]
}
