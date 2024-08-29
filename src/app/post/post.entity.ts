import {
  BaseEntity,
  Column,
  Entity,
  JoinColumn,
  JoinTable,
  ManyToMany,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { User } from '../auth/auth.entity';
import { Like } from '../like/like.entity';
import { ImagePost } from '../image/image.entity';
import { Comment } from '../comment/comment.entity';
import { savePost } from '../save-post/savePost.entity';
import { Tag } from '../tag/tag.entity';

@Entity()
export class Post extends BaseEntity {
    @PrimaryGeneratedColumn()
    id: number;
  @Column()
  judul: string;
  @Column()
  konten: string;
  @OneToMany(() => ImagePost, (image) => image.post_id, {
    onDelete: 'CASCADE',
    cascade: ['insert', 'update'],
  })
  images: ImagePost[];
  @Column({ type: 'datetime', default: () => 'CURRENT_TIMESTAMP' })
  created_at: Date;

  @Column({ type: 'datetime', default: () => 'CURRENT_TIMESTAMP' })
  updated_at: Date;
  @ManyToOne(() => User)
  @JoinColumn({ name: 'created_by' })
  created_by: User;
  @ManyToOne(() => User)
  @JoinColumn({ name: 'updated_by' })
  updated_by: User;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'user_id' })
  user: User;
  @OneToMany(() => Like, (like) => like.post_id, {
    onDelete: 'CASCADE',
  })
  likes: Like[];
  @OneToMany(() => savePost, (savePost) => savePost.post_id, {
    onDelete: 'CASCADE',
    cascade: ['insert', 'update'],
  })
  savePosts: savePost[];
  @OneToMany(() => Comment, (comment) => comment.post_id, {
    onDelete: 'CASCADE',
  })
  comments: Comment[];
  @ManyToMany(() => Tag, (tag) => tag.posts, {
    cascade: true,
    onDelete: 'CASCADE',
  })
  @JoinTable()
  tags: Tag[];
  @Column({ default: false })
  isBanned: boolean;
}
