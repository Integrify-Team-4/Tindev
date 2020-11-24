import { Entity, PrimaryGeneratedColumn, Column, BaseEntity } from 'typeorm'

@Entity()
export default class Education extends BaseEntity {
  @PrimaryGeneratedColumn()
  id!: number

  @Column()
  institute!: string

  @Column()
  degree!: string
}
