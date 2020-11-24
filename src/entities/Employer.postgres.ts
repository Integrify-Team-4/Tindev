import { Entity, PrimaryGeneratedColumn, Column, BaseEntity, JoinColumn } from 'typeorm'
import {Role}
@Entity()
export default class Employer {
  @PrimaryGeneratedColumn()
  id!: number

  @Column()
  companyName!: string

  @Column()
  companyInfo!: string

  @OneToOne(() => Role )
  @JoinColumn()
  roleId: Role;

  static getCompnayByName(name: string) {
    return this.find({ where: { companyName: name } })
  }
}
