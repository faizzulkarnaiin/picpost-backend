import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  UseGuards,
} from '@nestjs/common';
import { ReportService } from './report.service';
import { JwtGuard } from '../auth/auth.guard';
import { Pagination } from 'src/utils/decorator/pagination.decorator';
import { CreateReportPostDto, FindReport } from './report.dto';
@UseGuards(JwtGuard)
@Controller('report')
export class ReportController {
  constructor(private reportService: ReportService) {}
  @Get('list')
  async getAllReport(@Pagination() query: FindReport) {
    return this.reportService.findAll(query);
  }
  @Post('create/:id')
  createPost(@Param('id') id: string, @Body() payload: CreateReportPostDto) {
    return this.reportService.create(+id, payload);
  }
  @Delete('delete/:id')
  delete(@Param('id') id: string) {
    return this.reportService.deleteRepoert(+id);
  }
}
