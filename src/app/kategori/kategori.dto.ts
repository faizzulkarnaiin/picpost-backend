import { OmitType, PickType } from '@nestjs/mapped-types';
import { Type } from 'class-transformer';
import {
  ArrayNotEmpty,
  IsArray,
  IsInt,
  IsObject,
  IsOptional,
  IsString,
  ValidateNested,
  isObject,
} from 'class-validator';
import { PageRequestDto } from 'src/utils/dto/page.dto';

export class KategoriDto {
  @IsInt()
  id?: number;

  @IsString()
  nama_kategori: string;

  @IsObject()
  @IsOptional()
  created_by: { id: number };

  @IsObject()
  @IsOptional()
  updated_by: { id: number };
}

export class CreateKategoriDto extends OmitType(KategoriDto, ['id', 'updated_by']) {}
export class UpdateKategoriDto extends PickType(KategoriDto, [
  'nama_kategori',
  'updated_by'
]) {}
export class findAllKategori extends PageRequestDto {
  @IsString()
  @IsOptional()
  nama_kategori: string;
  @IsString()
  @IsOptional()
  nama_user: string;
}
export class CreateKategoriArrayDto {
  @IsArray()
  @ValidateNested()
  @Type(() => CreateKategoriDto)
  data: CreateKategoriDto[];
}
export class deleteKategoriArrayDto {
  @IsArray()
  @ArrayNotEmpty()
  delete: number[];
}
