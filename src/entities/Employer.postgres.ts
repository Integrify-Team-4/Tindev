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

  static getEmployerByCompanyName(companyName: string) {
    return this.findOne({ where: { companyName: companyName } })
  }

  static localLogin(email: string, password: string) {
    return this.find({ where: { email: email, password: password } })
  }

  static updateEmployer(id: string, update: Partial<Employer>) {
    return this.find({ where: { id: id, update: update } })
  }
}
