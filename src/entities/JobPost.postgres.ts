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

  @CreateDateColumn()
  createdAt!: Date

  @ManyToMany(() => Skill, { cascade: ['insert'], nullable: true })
  @JoinTable()
  requiredSkills!: Skill[]

  @ManyToOne(() => Employer, (employer) => employer.jobPosts, {
    cascade: ['insert'],
  })
  employer!: Employer

  static match(id: string) {
    return this.find({ where: { id: id } })
  }
}
