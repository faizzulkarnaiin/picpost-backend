import {
  IsInt,
  IsNotEmpty,
  Min,
  Max,
  Length,
  IsNumber,
  isArray,
  ValidateNested,
  IsArray,
  ArrayNotEmpty,
  IsOptional,
  IsString,
  IsIn,
  IsEnum,
  ValidatorConstraint,
  ValidatorConstraintInterface,
  ValidationArguments,
} from 'class-validator';
import { OmitType, PickType } from '@nestjs/mapped-types';
import { Type } from 'class-transformer';

export class createAndUpdateMobilDto {
  @IsString()
  nama: string;

  @IsString()
  @IsIn(['honda', 'toyota', 'suzuki'])
  merekMobil: string;

  @IsString()
  @IsIn(
    [
      'CRV',
      'BRV',
      'HRV',
      'Avanza',
      'Innova',
      'Raize',
      'Ertiga',
      'XL7',
      'Baleno',
    ],
    {},
  )
  tipeMobil: string;

  @IsInt()
  @Min(150000000)
  @Max(400000000)
  harga: number;

  @IsInt()
  @Min(2017)
  @Max(2023)
  tahun: number;
}
export class createMobilArrayDto {
  @IsArray()
  @ValidateNested()
  @Type(() => createAndUpdateMobilDto)
  data: createAndUpdateMobilDto[];
  
}

export class deleteMobilArrayDto {
  @IsArray()
  @ArrayNotEmpty()
  delete: number[];
}

export class FindMobilDto {
  @IsOptional()
  nama: string;

  @IsOptional()
  merekMobil: string;

  @IsOptional()
  tipeMobil: string;

  @IsOptional()
  @IsInt()
  @Type(() => Number)
  from_harga: number;
  @IsOptional()
  @IsInt()
  @Type(() => Number)
  to_harga: number;
  @IsOptional()
  @IsInt()
  @Type(() => Number)
  from_year: number;

  @IsOptional()
  @IsInt()
  @Type(() => Number)
  to_year: number;
}
