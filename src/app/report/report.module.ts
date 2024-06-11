import { Module } from '@nestjs/common';
import { ReportService } from './report.service';
import { ReportController } from './report.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ReportPost } from './report.entity';

@Module({
  imports : [TypeOrmModule.forFeature([ReportPost])],
  providers: [ReportService],
  controllers: [ReportController]
})
export class ReportModule {}
