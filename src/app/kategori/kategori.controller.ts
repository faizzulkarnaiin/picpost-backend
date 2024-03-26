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
import { InjectCreatedBy } from 'src/utils/decorator/createdBy.decorator';
import { InjectUpdatedBy } from 'src/utils/decorator/updatedBy.decorator';
import { InjectCreatedByBulk } from 'src/utils/decorator/createdByBulk.decorator';

@UseGuards(JwtGuard)
@Controller('kategori')
export class KategoriController {
  constructor(private kategoriService: KategoriService) {}

  @Post('create')
  async create(@InjectCreatedBy() payload: CreateKategoriDto) {
    return this.kategoriService.create(payload);
  }

  @Get('list')
  async getAllCategory(@Pagination() query: findAllKategori) {
    return this.kategoriService.getAllCategory(query);
  }
  @Get('user/list')
  async getUserCategory() {
    return this.kategoriService.getUserCategory();
  }
  @Put('update/:id')
  updateKategori(@Param('id') id: string, @InjectUpdatedBy() payload: UpdateKategoriDto) {
    return this.kategoriService.update(Number(id), payload);
  }
  @Delete('delete/:id')
  deleteKategori(@Param('id') id: string) {
    return this.kategoriService.deleteKategori(+id);
  }
  @Get('detail/:id')
  findOneKategori(@Param('id') id: string) {
    return this.kategoriService.getDetail(Number(id));
  }
  @Post('create/bulk')
  createBulk(@InjectCreatedByBulk() payload: CreateKategoriArrayDto) {
    return this.kategoriService.bulkCreate(payload);
  }
  @Post('delete/bulk')
  deleteBulk(@Body() payload: deleteKategoriArrayDto) {
    return this.kategoriService.bulkDelete(payload);
  }
}
