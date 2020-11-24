import { Entity, Column, BaseEntity, PrimaryGeneratedColumn } from 'typeorm'

@entity()
export default class Role extends BaseEntity {
  @PrimaryGeneratedColumn()
  id!: number
}
