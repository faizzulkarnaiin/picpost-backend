import { Controller, Delete, Get, Param, UseGuards } from '@nestjs/common';
import { LikeService } from './like.service';
import { JwtGuard } from '../auth/auth.guard';
import { InjectCreatedBy } from 'src/utils/decorator/createdBy.decorator';
import { CreateLikeDto, FindLikeByPostId, FindLikeByuser } from './like.dto';
import { Pagination } from 'src/utils/decorator/pagination.decorator';
import { query } from 'express';
@UseGuards(JwtGuard)
@Controller('like')
export class LikeController {
  constructor(private readonly likeService: LikeService) {}
  @Get('create/:id')
  async create(
    @Param('id') id: string,
    @InjectCreatedBy() payload: CreateLikeDto,
  ) {
    return this.likeService.create(+id, payload);
  }
  @Get('listById')
  getLikeByUser(@Pagination() query: FindLikeByuser) {
    return this.likeService.getLikeByUser(query);
  }
  @Get('list/:id')
  getLikeByPost(
    @Pagination() query: FindLikeByPostId,
    @Param('id') id: string,
  ) {
    return this.likeService.getLikeByPost(query, +id);
  }
  @Delete('delete/:id')
  deleteLike(@Param('id') id: string) {
    return this.likeService.deleteLike(+id);
  }
}
