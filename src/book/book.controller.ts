import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Put,
  Delete,
  Query
} from '@nestjs/common';
import { BookService } from './book.service';
import { CreateBookDto, FindBookDto, UpdateBookDto, createBookArrayDto, deleteBookArrayDto } from './book.dto';
import { Pagination } from 'src/utils/decorator/pagination.decorator';
import { find } from 'rxjs';
// import { FindBookDto } from 'src/utils/dto/page.dto';

@Controller('book')
export class BookController {
  constructor(private bookService: BookService) {}

  @Get('/list')
  findAllBook(@Pagination() findBook: FindBookDto) {
    console.log(findBook)
    return this.bookService.getAllBooks(findBook);
  }

  @Post('create')
  createBook(@Body() payload: CreateBookDto) {
    return this.bookService.createBook(payload);
  }

  @Put('update/:id')
  updateBook(@Param('id') id: string, @Body() payload: UpdateBookDto) {
    return this.bookService.updateBook(Number(id), payload);
  }

  @Delete('delete/:id')
  deleteBook(@Param('id') id: string) {
    return this.bookService.deleteBook(+id);
  }

  @Get('detail/:id')
  findOneBook(@Param('id') id: string) {
    return this.bookService.getDetail(Number(id));
  }

  @Post('create/bulk')
  createBulk( @Body() payload: createBookArrayDto) {
    return this.bookService.bulkCreate(payload);
  }

  @Post('delete/bulk')
  deleteBulk( @Body() payload: deleteBookArrayDto) {
    return this.bookService.bulkDelete(payload);
  }



  array = [
    {
      id: 1,
    },
    {
      id: 2,
    },
    {
      id: 3,
    },
  ];
}
