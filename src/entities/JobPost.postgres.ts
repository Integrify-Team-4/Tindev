import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  BaseEntity,
  ManyToMany,
  JoinTable,
  ManyToOne,
  CreateDateColumn,
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

  @Column({ nullable: true })
  startingDate!: string

  @CreateDateColumn()
  createdAt!: Date

  @ManyToMany(() => Skill, (skill) => skill.jobPosts, {
    cascade: true,
  })
  @JoinTable()
  skills!: Skill[]

  @ManyToOne(() => Employer, (employer) => employer.jobPosts, {
    cascade: ['insert'],
    eager: true,
  })
  employer!: Employer
}
