import { OmitType } from '@nestjs/mapped-types';
import { Type } from 'class-transformer';
import { IsInt, IsNotEmpty, IsNumber, IsOptional, IsString, Length } from 'class-validator';
import { PageRequestDto } from 'src/utils/dto/page.dto';
import { Items } from './items.entity';

export class ItemsDto {
  @IsNumber()
  id: number;
  @IsNotEmpty()
  @Length(4, 100)
  nama: string;
  @IsNotEmpty()
  price: number;
  @IsString()
  imgUrl: string;
}

export class FindItemsDto extends PageRequestDto {
    @IsOptional()
    nama : string;
  
    @IsOptional()
    price: number;
  
    @IsOptional()
    @IsInt()
    @Type(() => Number)
    from_year: number;
  
    @IsOptional()
    @IsInt()
    @Type(() => Number)
    to_year: number;
}

export class CreateItemsDto extends OmitType(ItemsDto, ['id']) {}