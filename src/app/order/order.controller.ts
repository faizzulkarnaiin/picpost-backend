import { Controller, Delete, Get, Param, Post, Res, UseGuards } from '@nestjs/common';
import { OrderService } from './order.service';
import { InjectCreatedBy } from 'src/utils/decorator/createdBy.decorator';
import { CreateOrderDto, findAllOrderDto } from './order.dto';
import { Pagination } from 'src/utils/decorator/pagination.decorator';
import { JwtGuard } from '../auth/auth.guard';
@UseGuards(JwtGuard)
@Controller('order')
export class OrderController {
  constructor(private readonly orderService: OrderService) {}
  @Post('create')
  async createOrder(@InjectCreatedBy() payload: CreateOrderDto) {
    return this.orderService.createOrder(payload);
  }
  @Get('list')
  async listOrder(@Pagination() query: findAllOrderDto) {
    return this.orderService.findAll(query);
  }
  @Get('detail/:id')
  async detailOrder(@Param('id') id: string) {
    return this.orderService.findById(+id);
  }
  @Delete('delete/:id')
  async deleteOrder(@Param('id') id: number) {
    return this.orderService.deleteOrder(+id);
  }
  @Get('download-report-excel')
  async excelReport(
    @Res() res: Response,
    @Pagination() query: findAllOrderDto,
  ) {
    return this.orderService.pdfReport(query, res);
  }
}
