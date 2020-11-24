import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  BaseEntity,
  JoinColumn,
} from 'typeorm'
import Role from './Role.postgres'

@Entity()
export default class Employer {
  @PrimaryGeneratedColumn()
  id!: number

  @Column()
  companyName!: string

  @Column()
  companyInfo!: string

  @OneToOne(() => Role)
  @JoinColumn()
  role!: Role

  static getCompnayByName(name: string) {
    return this.find({ where: { companyName: name } })
  }
}
