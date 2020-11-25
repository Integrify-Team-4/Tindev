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
  email!: string

  @Column()
  password!: string

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

  static localLogin(email: string, password: string) {
    return this.find({ where: { email: email, password: password } })
  }
}
