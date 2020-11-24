import { Entity, Column, BaseEntity, PrimaryGeneratedColumn } from 'typeorm'

@Entity()
export default class Role extends BaseEntity {
  @PrimaryGeneratedColumn()
  id!: number
}
