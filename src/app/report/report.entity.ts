import {
  BaseEntity,
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryColumn,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { User } from '../auth/auth.entity';
import { Post } from '../post/post.entity';

@Entity()
export class ReportPost extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  alasan: string;
  @ManyToOne(() => User)
  @JoinColumn({ name: 'created_by' })
  created_by: User;
  @ManyToOne(() => Post)
  @JoinColumn({ name: 'post_id' })
  post_id: Post;
  @Column({ type: 'datetime', default: () => 'CURRENT_TIMESTAMP' })
  created_at: Date;
}
