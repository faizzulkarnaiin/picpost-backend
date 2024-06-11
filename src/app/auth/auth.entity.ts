import {
  Entity,
  BaseEntity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
  OneToOne,
  JoinColumn,
} from 'typeorm';
import { ResetPassword } from '../mail/reset_password.entity';
import { Post } from '../post/post.entity';
import { Like } from '../like/like.entity';
import { Profile } from '../profile/profile.entity';
import { savePost } from '../save-post/savePost.entity';
import { Following } from '../following/following.entity';
import { Followers } from '../followers/followers.entity';
import { Tag } from '../tag/tag.entity';
export enum Gender {
  MALE = 'male',
  FEMALE = 'female',
}
@Entity()
export class User extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: true })
  avatar: string;

  @Column({ nullable: false })
  nama: string;

  @Column({ nullable: false })
  email: string;

  @Column({ nullable: true })
  password: string;
  @Column({ nullable: true })
  client_id: string;
  @Column({ nullable: true })
  bio: string;
  @Column({ nullable: true })
  nama_lengkap: string;
  @Column({ type: 'enum', enum: Gender, default: Gender.MALE })
  gender: Gender;
  @Column({ nullable: false })
  provider: string;
  @Column({ nullable: true })
  refresh_token: string;

  @Column({ nullable: true })
  role: string;

  @OneToMany(() => ResetPassword, (reset) => reset.user)
  reset_password: ResetPassword;
  @OneToMany(() => Post, (post) => post.user, {
    onDelete: 'CASCADE',
  })
  post: Post[];

  @Column({ type: 'datetime', default: () => 'CURRENT_TIMESTAMP' })
  created_at: Date;

  @Column({ type: 'datetime', default: () => 'CURRENT_TIMESTAMP' })
  updated_at: Date;
  @OneToMany(() => Like, (like) => like.user_id, {
    onDelete: 'CASCADE',
  })
  likes: Like[];
  @OneToMany(() => savePost, (saveP) => saveP.user_id, {
    onDelete: 'CASCADE',
  })
  savePost: savePost[];
  @OneToOne(() => Profile)
  @JoinColumn()
  profile: Profile;
  @OneToMany(() => Following, (following) => following.follower)
  following: Following[];
  @OneToMany(() => Followers, (followers) => followers.follower, {
    onDelete: 'CASCADE',
  })
  followers: Followers[];
  @OneToMany(() => Tag, (tag) => tag.created_by, {
    onDelete: 'NO ACTION',
  })
  tag: Tag[];
  @Column({ default: false })
  isBanned: boolean;
}
