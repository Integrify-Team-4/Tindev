import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  BaseEntity,
  OneToMany,
  ManyToMany,
  JoinTable,
  JoinColumn,
} from 'typeorm'

//import Company from './Company.postgres.ts'
//import Skill from './Skills.postgres.ts'

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

  // @ManyToMany(type => Skill) @JoinTable()
  // details: Skill

  // @OneToMany(type => Company) @JoinColumn()
  // details: Company

  static getJobPostByTitle(title: string) {
    return this.find({ where: { title: title } })
  }

  static getJobPostBySeniority(seniority: string) {
    return this.find({ where: { seniority: seniority } })
  }
}
