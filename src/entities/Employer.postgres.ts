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

  @OneToOne(() => Credential, (credential) => credential.employer, {
    cascade: true,
  })
  @JoinColumn()
  credentials!: Credential

  @OneToMany(() => JobPost, (jobPost) => jobPost.employer, {
    cascade: ['remove'],
  })
  jobPosts!: JobPost[]

  static getEmployerByCompanyName(companyName: string) {
    return this.find({ where: { companyName: companyName } })
  }

  static localLogin(email: string, password: string) {
    return this.find({ where: { email: email, password: password } })
  }
}
