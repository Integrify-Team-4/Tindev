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

@Entity()
export default class JobSeeker extends BaseEntity {
  @PrimaryGeneratedColumn()
  id!: number

  @Column()
  firstName!: string

  @Column()
  lastName!: string

  @Column()
  email!: string

  @Column()
  password!: string

  @Column()
  image!: string

  @Column()
  contact!: number

  @Column()
  relocate!: boolean

  @Column()
  seniority!: string

  @Column()
  startingDate!: Date

  @CreateDateColumn()
  created!: Date

  @Column({
    default: 'job seeker',
  })
  role!: string

  @OneToOne(() => Education, { cascade: true })
  @JoinColumn()
  education!: Education

  @ManyToMany(() => Skill)
  @JoinTable()
  skills!: Skill[]
}
