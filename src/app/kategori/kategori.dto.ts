import { OmitType, PickType } from '@nestjs/mapped-types';
import { Type } from 'class-transformer';
import {
  ArrayNotEmpty,
  IsArray,
  IsInt,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';
import { PageRequestDto } from 'src/utils/dto/page.dto';

export class KategoriDto {
  @IsInt()
  id?: number;

  @IsString()
  nama_kategori: string;
}

export class CreateKategoriDto extends OmitType(KategoriDto, ['id']) {}
export class UpdateKategoriDto extends PickType(KategoriDto, [
  'nama_kategori',
]) {}
export class findAllKategori extends PageRequestDto {
  @IsString()
  @IsOptional()
  nama_kategori: string;
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
