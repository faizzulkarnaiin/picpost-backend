import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Put,
  Delete,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { create } from 'domain';
import { CreateUserDto, DeleteUserDto, DetailUserDto, FindUserDto, UpdateUserDto, UserDto, createUserArrayDto, deleteUserArrayDto } from './user.dto';
import { Pagination } from 'src/utils/decorator/pagination.decorator';

@Controller('users')
export class UsersController {
  constructor(private usersService: UsersService) {}

  @Get('/list')
  findAllUsers(@Pagination() findUser : FindUserDto)  {
    return this.usersService.getAllUsers(findUser);
  }

  @Post('create')
  createUsers(@Body() payload: CreateUserDto) {
    return this.usersService.createUser(payload);
  }

  @Delete('delete/:id')
  deleteBook(@Param('id') DeleteUserDto) {
    return this.usersService.deleteUser(+DeleteUserDto);
  }

  @Put('update/:id')
  updateBook(@Param('id') id: string, @Body() payload: UpdateUserDto) {
    return this.usersService.updateUser(Number(id), payload);
  }
  @Get('detail/:id')
  findOneBook(@Param('id') DetailUserDto) {
    return this.usersService.getDetail(Number(DetailUserDto));
  }

  @Post('create/bulk')
  createBulk( @Body() payload: createUserArrayDto) {
    return this.usersService.bulkCreate(payload);
  }

  @Post('delete/bulk')
  deleteBulk( @Body() payload: deleteUserArrayDto) {
    return this.usersService.bulkDelete(payload);
  }

  
}
