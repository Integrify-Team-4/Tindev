import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  BaseEntity,
  ManyToMany,
  JoinTable,
  ManyToOne,
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

  @ManyToMany(() => Skill)
  @JoinTable() // specifies that this is the owner side of the relationship
  requiredSkills!: Skill[]

  @ManyToOne(() => Employer, (employer) => employer.jobPosts)
  employer!: Employer
}
