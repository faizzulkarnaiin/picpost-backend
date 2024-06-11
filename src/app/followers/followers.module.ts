import { Module } from '@nestjs/common';
import { FollowersService } from './followers.service';
import { FollowersController } from './followers.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Followers } from './followers.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Followers])],
  providers: [FollowersService],
  controllers: [FollowersController],
})
export class FollowersModule {}
