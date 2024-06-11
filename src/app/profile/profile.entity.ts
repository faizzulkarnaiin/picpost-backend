import { BaseEntity, Column, Entity, JoinColumn, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { User } from "../auth/auth.entity";
export enum Gender {
    MALE = 'male',
    FEMALE = 'female',
  }
@Entity()
export class Profile extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  fullName: string;

  @Column()
  bio: string;

  @Column()
  email: string;

  @Column()
  phone_number: string;

  @Column({ type: 'enum', enum: Gender, default: Gender.MALE })
  gender: Gender;

  @OneToOne(() => User, (user) => user.profile) 
  user_id: User
  // @OneToOne(() => User, (user) => user.profile) 
  // created_by: User
}