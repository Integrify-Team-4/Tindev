import { Entity, Column, BaseEntity, PrimaryGeneratedColumn } from 'typeorm'

@Entity()
export default class Skill extends BaseEntity {
  @PrimaryGeneratedColumn()
  id!: number

  @Column()
  skill!: string
}
