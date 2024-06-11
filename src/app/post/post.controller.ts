import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  UploadedFile,
  UseGuards,
} from '@nestjs/common';
import { JwtGuard } from '../auth/auth.guard';
import { PostService } from './post.service';
import { Pagination } from 'src/utils/decorator/pagination.decorator';
import {
  BanPostDto,
  CreatePostDto,
  FindAllPost,
  UpdatePostDto,
} from './post.dto';

@Controller('post')
export class PostController {
  constructor(private postService: PostService) {}
  @Get('list')
  async getAllPost(@Pagination() query: FindAllPost) {
    return this.postService.findAll(query);
  }
  @UseGuards(JwtGuard)
  @Post('create')
  createPost(@Body() payload: CreatePostDto) {
    return this.postService.createPost(payload);
  }
  @UseGuards(JwtGuard)
  @Get('listById')
  getPostByUser() {
    return this.postService.getPostByuser();
  }
  @UseGuards(JwtGuard)
  @Get('list/user/:id')
  getPostByUserId(@Param('id') id: string) {
    return this.postService.getPostByuserId(+id);
  }
  @UseGuards(JwtGuard)
  @Delete('delete/:id')
  deletePost(@Param('id') id: string) {
    return this.postService.deletePost(+id);
  }
  @UseGuards(JwtGuard)
  @Put('update/:id')
  updatePost(@Param('id') id: string, @Body() payload: UpdatePostDto) {
    return this.postService.updatePost(+id, payload);
  }
  @UseGuards(JwtGuard)
  @Put('ban/:id')
  banPost(@Param('id') id: string, @Body() payload: BanPostDto) {
    return this.postService.banPost(+id, payload);
  }
  @UseGuards(JwtGuard)
  @Put('unBan/:id')
  unBanPost(@Param('id') id: string, @Body() payload: BanPostDto) {
    return this.postService.unBanPost(+id, payload);
  }
  @UseGuards(JwtGuard)
  @Get('detail/:id')
  getdetail(@Param('id') id: string) {
    return this.postService.getDetailById(+id);
  }
  @UseGuards(JwtGuard)
  @Get('listAll')
  async getAllPostWithBan(@Pagination() query: FindAllPost) {
    return this.postService.findAllWithBan(query);
  }
}
