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

  @ManyToMany(() => Skill, { nullable: true })
  @JoinTable()
  requiredSkills!: Skill[]

  //**Too complicated as for now, let's settle with requiredSkills first */
  // @ManyToMany(() => Skill, { nullable: true })
  // @JoinTable()
  // optionalSkills!: Skill[]

  @ManyToOne(() => Employer, (employer) => employer.jobPosts, {
    cascade: ['insert'],
  })
  employer!: Employer

  static match(id: string) {
    return this.find({ where: { id: id } })
  }
}
