import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Put,
  Delete,
  Query,
} from '@nestjs/common';
import { ItemsService } from './items.service';
import { Pagination } from 'src/utils/decorator/pagination.decorator';
import { CreateItemsDto, FindItemsDto } from './items.dto';

@Controller('items')
export class ItemsController {
  constructor(private itemService: ItemsService) {}
  @Get('/list')
  findAllBook(@Pagination() findItems: FindItemsDto) {
    console.log(findItems);
    return this.itemService.getAllUsers(findItems);
  }

  @Post('create')
  createBook(@Body() payload: CreateItemsDto) {
    return this.itemService.createItems(payload);
  }
}
