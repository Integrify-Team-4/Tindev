import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  BaseEntity,
  ManyToMany,
  JoinTable,
  ManyToOne,
  OneToMany,
} from 'typeorm'

import Employer from './Employer.postgres'
import Skill from './Skill.postgres'

@Entity()
export default class JobPost extends BaseEntity {
  @PrimaryGeneratedColumn()
  id!: number

  @Column()
  title!: string

  @Column()
  jobDescription!: string

  @Column()
  seniority!: string

  @Column()
  createdAt!: Date

  @OneToMany(() => Skill, (skill) => skill.jobPost)
  requiredSkills!: Skill[]

  @ManyToOne(() => Employer, (employer) => employer.jobPosts)
  employer!: Employer
}
