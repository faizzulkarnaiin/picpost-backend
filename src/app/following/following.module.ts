import { Module } from '@nestjs/common';
import { FollowingService } from './following.service';
import { FollowingController } from './following.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Following } from './following.entity';
import { Followers } from '../followers/followers.entity';
import { IsNotSelfFollowGuard } from 'src/utils/decorator/isNotFollow.decorator';

@Module({
  imports : [TypeOrmModule.forFeature([Following, Followers])],
  providers: [FollowingService, IsNotSelfFollowGuard],
  controllers: [FollowingController]
})
export class FollowingModule {}
