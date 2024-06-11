import { Controller, Get, Param, UseGuards } from '@nestjs/common';
import { JwtGuard } from '../auth/auth.guard';
import { FollowersService } from './followers.service';
import { FindFollowersByUser } from './followers.dto';
import { Pagination } from 'src/utils/decorator/pagination.decorator';
@UseGuards(JwtGuard)
@Controller('followers')
export class FollowersController {
  constructor(private followerService: FollowersService) {}
  @Get('list/followers')
  getFollowers(@Pagination() query) {
    return this.followerService.getFollowerByUserId(query);
  }
  @Get('list/detail/:id')
  getFollowersById(@Pagination() query, @Param('id') id: string) {
    return this.followerService.getFollowerByUser(query, +id);
  }
}
