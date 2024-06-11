import {
  BaseEntity,
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Post } from '../post/post.entity';

@Entity()
export class ImagePost extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  url: string;
  @ManyToOne(() => Post, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'post_id' })
  post_id: Post;
}
