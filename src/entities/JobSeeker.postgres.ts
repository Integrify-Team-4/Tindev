import { Entity, Column, BaseEntity, PrimaryGeneratedColumn } from 'typeorm'
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
  userId!: string
  @Column()
  password!: string
  @Column()
  profileImage!: string
  @Column()
  contactNo!: string
  @Column()
  rollId!: string
  @Column()
  relocate!: boolean
  @Column()
  experience!: string
  @Column()
  seniority!: string
  @Column()
  startingDate!: Date
  @Column()
  signupDate!: Date
}
