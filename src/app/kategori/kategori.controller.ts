import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';
import { JwtGuard } from '../auth/auth.guard';
import { KategoriService } from './kategori.service';
import { Pagination } from 'src/utils/decorator/pagination.decorator';
import {
  CreateKategoriArrayDto,
  CreateKategoriDto,
  UpdateKategoriDto,
  deleteKategoriArrayDto,
  findAllKategori,
} from './kategori.dto';

@UseGuards(JwtGuard)
@Controller('kategori')
export class KategoriController {
  constructor(private kategoriService: KategoriService) {}

  @Post('create')
  async create(@Body() payload: CreateKategoriDto) {
    return this.kategoriService.create(payload);
  }

  @Get('list')
  async getAllCategory(@Pagination() query: findAllKategori) {
    return this.kategoriService.getAllCategory(query);
  }
  @Put('update/:id')
  updateBook(@Param('id') id: string, @Body() payload: UpdateKategoriDto) {
    return this.kategoriService.update(Number(id), payload);
  }
  @Delete('delete/:id')
  deleteBook(@Param('id') id: string) {
    return this.kategoriService.deleteKategori(+id);
  }
  @Get('detail/:id')
  findOneBook(@Param('id') id: string) {
    return this.kategoriService.getDetail(Number(id));
  }
  @Post('create/bulk')
  createBulk(@Body() payload: CreateKategoriArrayDto) {
    return this.kategoriService.bulkCreate(payload);
  }
  @Post('delete/bulk')
  deleteBulk(@Body() payload: deleteKategoriArrayDto) {
    return this.kategoriService.bulkDelete(payload);
  }
}
