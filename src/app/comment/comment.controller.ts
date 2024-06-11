import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  UseGuards,
} from '@nestjs/common';
import { CommentService } from './comment.service';
import { JwtGuard } from '../auth/auth.guard';
import {
  CreateCommentDto,
  FindAllComment,
  FindCommentByPost,
} from './comment.dto';
import { Pagination } from 'src/utils/decorator/pagination.decorator';
import { runInThisContext } from 'vm';
@UseGuards(JwtGuard)
@Controller('comment')
export class CommentController {
  constructor(private commentService: CommentService) {}
  @Post('create/:id')
  createComment(@Body() payload: CreateCommentDto, @Param('id') id: string) {
    return this.commentService.createComment(payload, +id);
  }
  @Get('list')
  getAllComment(@Pagination() query: FindAllComment) {
    return this.commentService.findAllComment(query);
  }
  @Delete('delete/:id')
  deleteComment(@Param('id') id: string) {
    return this.commentService.deleteComment(+id);
  }
  @Get('list/:id')
  getCommentByPost(
    @Pagination() query,
    @Param('id') id: string,
  ) {
    return this.commentService.getCommentByPost(query, +id);
  }
}
