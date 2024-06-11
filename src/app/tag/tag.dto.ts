import { OmitType } from '@nestjs/mapped-types';
import { IsInt, IsObject, IsOptional, IsString } from 'class-validator';
import { PageRequestDto } from 'src/utils/dto/page.dto';

export class TagDto {
  @IsInt()
  @IsOptional()
  id?: number;

  @IsString()
  name: string;

  @IsObject()
  @IsOptional()
  created_by: { id: number };
}
export class CreateTag extends OmitType(TagDto, ['id']) {}

export class findAllTag extends PageRequestDto {
  @IsString()
  @IsOptional()
  keyword: string;
}
