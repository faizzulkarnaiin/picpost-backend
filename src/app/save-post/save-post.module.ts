import { Module } from '@nestjs/common';
import { SavePostService } from './save-post.service';
import { SavePostController } from './save-post.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { savePost } from './savePost.entity';

@Module({
  imports : [TypeOrmModule.forFeature([savePost])],
  providers: [SavePostService],
  controllers: [SavePostController]
})
export class SavePostModule {}
