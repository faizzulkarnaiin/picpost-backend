import { Controller, Delete, Get, Param, UseGuards } from '@nestjs/common';
import { SavePostService } from './save-post.service';
import { JwtGuard } from '../auth/auth.guard';
import { InjectCreatedBy } from 'src/utils/decorator/createdBy.decorator';
import { CreateSavePostDto, FindSaveByUser } from './savePost.dto';
import { Pagination } from 'src/utils/decorator/pagination.decorator';
import { query } from 'express';
@UseGuards(JwtGuard)
@Controller('save-post')
export class SavePostController {
  constructor(private savePostService: SavePostService) {}
  @Get('create/:id')
  async create(
    @Param('id') id: string,
    @InjectCreatedBy() payload: CreateSavePostDto,
  ) {
    return this.savePostService.create(+id, payload);
  }
  @Get('listById')
  getSaveByUser(@Pagination() query: FindSaveByUser) {
    return this.savePostService.getSavePostByUser(query);
  }
  @Delete('delete/:id')
  deleteLike(@Param('id') id: string) {
    return this.savePostService.delete(+id);
  }
}
