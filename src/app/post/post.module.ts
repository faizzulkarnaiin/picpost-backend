import { Module } from '@nestjs/common';
import { PostService } from './post.service';
import { PostController } from './post.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Post } from './post.entity';
import { Tag } from '../tag/tag.entity';
import { Following } from '../following/following.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Post, Tag, Following])],
  providers: [PostService],
  controllers: [PostController],
})
export class PostModule {}
