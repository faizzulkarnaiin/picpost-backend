import { Body, Controller, Delete, Get, Param, Post, Put, UseGuards } from '@nestjs/common';
import { ProdukService } from './produk.service';
import { JwtGuard } from '../auth/auth.guard';
import { Pagination } from 'src/utils/decorator/pagination.decorator';
import { CreateProdukArrayDto, DeleteProdukArrayDto, UpdateProdukDto, findAllProduk } from './produk.dto';
@UseGuards(JwtGuard)
@Controller('produk')
export class ProdukController {
  constructor(private produkService: ProdukService) {}
  @Get('list')  
  async getAllCategory(@Pagination() query: findAllProduk) {
    return this.produkService.findAll(query);
  }
  @Put('update/:id')
  updateProduk(@Param('id') id: string, @Body() payload: UpdateProdukDto) {
    return this.produkService.update(Number(id), payload);
  }
  @Delete('delete/:id')
  deleteProduk(@Param('id') id: string) {
    return this.produkService.deleteProduk(+id);
  }
  @Get('detail/:id')
  findOneProduk(@Param('id') id: string) {
    return this.produkService.getDetail(Number(id));
  }
  @Post('create/bulk')
  createBulk(@Body() payload: CreateProdukArrayDto) {
    return this.produkService.createBulk(payload);
  }
  @Post('delete/bulk')
  deleteBulk(@Body() payload: DeleteProdukArrayDto) {
    return this.produkService.bulkDelete(payload);
  }
}
