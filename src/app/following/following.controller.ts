import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  UseGuards,
} from '@nestjs/common';
import { FollowingService } from './following.service';
import { CreateFollowingDto, FindAllFollowed } from './following.dto';
import { JwtGuard } from '../auth/auth.guard';
import { Pagination } from 'src/utils/decorator/pagination.decorator';
import { IsNotSelfFollowGuard } from 'src/utils/decorator/isNotFollow.decorator';
import { query } from 'express';
@UseGuards(JwtGuard)
@Controller('following')
export class FollowingController {
  constructor(private readonly followingService: FollowingService) {}

  @Get('create/:id')
  // @UseGuards(IsNotSelfFollowGuard)
  async create(@Param('id') id: string, @Body() payload: CreateFollowingDto) {
    return this.followingService.createFollowing1(+id);
  }
  @Get('list/followed')
  getfollowedByUser(@Pagination() query) {
    return this.followingService.getFollowingByUserId(query);
  }
  @Get('list/followed/:id')
  getfollowedByUserId(@Pagination() query, @Param('id') id :string) {
    return this.followingService.getFollowingByUser(query, +id);
  }
  @Delete('delete/:id')
  delete(@Param('id') id: string) {
    return this.followingService.deleteFollow(+id);
  }
}
