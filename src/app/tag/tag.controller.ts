import { Controller, Get, Param, UseGuards } from '@nestjs/common';
import { JwtGuard } from '../auth/auth.guard';
import { TagService } from './tag.service';
import { Pagination } from 'src/utils/decorator/pagination.decorator';
import { findAllTag } from './tag.dto';
@UseGuards(JwtGuard)
@Controller('tag')
export class TagController {
  constructor(private tagService: TagService) {}
  @Get('list')
  getTag(@Pagination() query: findAllTag) {
    return this.tagService.getTag(query);
  }
  @Get('detail/:id')
  getdetail(@Param('id') id: string) {
    return this.tagService.getDetailById(+id);
  }
}
