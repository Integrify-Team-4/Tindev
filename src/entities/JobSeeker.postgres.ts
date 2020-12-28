import {
  Entity,
  Column,
  BaseEntity,
  PrimaryGeneratedColumn,
  OneToOne,
  JoinColumn,
  CreateDateColumn,
  ManyToMany,
  JoinTable,
} from 'typeorm'

import Education from './Education.postgres'
import Skill from './Skill.postgres'
import Credential from './Credential.postgres'

@Entity()
export default class JobSeeker extends BaseEntity {
  @PrimaryGeneratedColumn()
  id!: number

  @Column({ nullable: true })
  firstName!: string

  @Column({ nullable: true })
  lastName!: string

  @Column({ nullable: true })
  image!: string

  @Column({ nullable: true })
  contact!: number

  @Column({ nullable: true })
  relocate!: boolean

  @Column({ nullable: true })
  seniority!: string

  @Column({ nullable: true })
  startingDate!: string

  @CreateDateColumn()
  created!: Date

  @Column({
    default: 'job seeker',
  })
  role!: string

  @OneToOne(() => Credential, (credential) => credential.jobSeeker, {
    cascade: true,
  })
  @JoinColumn()
  credentials!: Credential

  @OneToOne(() => Education, { cascade: true })
  @JoinColumn()
  education!: Education

  @ManyToMany(() => Skill, (skill) => skill.jobSeekers, {
    cascade: true,
    eager: true,
  })
  @JoinTable()
  skills!: Skill[]

  static getByFirstName(firstName: string) {
    return this.find({ where: { firstName: firstName } })
  }

  static match(id: string) {
    return this.find({ where: { id: id } })
  }
}
