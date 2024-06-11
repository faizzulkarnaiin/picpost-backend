import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';

import { typeOrmConfig } from './config/typeorm.config';
import { TypeOrmModule } from '@nestjs/typeorm';

import { AuthModule } from './app/auth/auth.module';
import { MailModule } from './app/mail/mail.module';
import { ConfigModule } from '@nestjs/config';

import { join } from 'path';
import { ServeStaticModule } from '@nestjs/serve-static';
import { UploadController } from './app/upload/upload.controller';
import { UniqueValidator } from './app/validator/unique.validator';
import { PostModule } from './app/post/post.module';
import { LikeModule } from './app/like/like.module';
import { CommentModule } from './app/comment/comment.module';
import { SavePostModule } from './app/save-post/save-post.module';
import { ProfileModule } from './app/profile/profile.module';
import { FollowersModule } from './app/followers/followers.module';
import { FollowingModule } from './app/following/following.module';
import { IsNotSelfFollowGuard } from './utils/decorator/isNotFollow.decorator';
import { TagModule } from './app/tag/tag.module';
import { ReportModule } from './app/report/report.module';
@Module({
  imports: [
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'public'),
    }),
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRoot(typeOrmConfig),
    AuthModule,
    MailModule,
    PostModule,
    LikeModule,
    CommentModule,
    SavePostModule,
    ProfileModule,
    FollowersModule,
    FollowingModule,
    TagModule,
    ReportModule,
  ],
  controllers: [AppController, UploadController],
  providers: [AppService, UniqueValidator],
})
export class AppModule {}
