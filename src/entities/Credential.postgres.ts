import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  BaseEntity,
  OneToOne,
} from 'typeorm'

import JobSeeker from './JobSeeker.postgres'
import Employer from './Employer.postgres'

@Entity()
export default class Credential extends BaseEntity {
  @PrimaryGeneratedColumn()
  id!: number

  @Column()
  email!: string

  @Column()
  password!: string

  @Column()
  role!: string

  @OneToOne(() => JobSeeker, (jobSeeker) => jobSeeker.credentials)
  jobSeeker!: JobSeeker

  @OneToOne(() => Employer, (employer) => employer.credentials)
  employer!: Employer
}
