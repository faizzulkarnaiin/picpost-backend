import { OmitType } from '@nestjs/mapped-types';
import { IsInt, IsObject, IsOptional, IsString } from 'class-validator';
import { PageRequestDto } from 'src/utils/dto/page.dto';

export class ReportDto {
  @IsInt()
  id?: number;
  @IsString()
  alasan: string;
  @IsObject()
  @IsOptional()
  created_by: { id: number };
  @IsObject()
  @IsOptional()
  post_id: { id: number };
}

export class CreateReportPostDto extends OmitType(ReportDto, ['id']) {}
export class FindReport extends PageRequestDto {
  @IsString()
  @IsOptional()
  keyword: string;
}
