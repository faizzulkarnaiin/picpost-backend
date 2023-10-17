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
  IsEmail,
} from 'class-validator';
import { OmitType, PickType } from '@nestjs/mapped-types';
import { Type } from 'class-transformer';
export class BelajarDto {
  @IsNumber()
  id: number;

  @IsNotEmpty()
  @Length(6, 12)
  username: string;
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsNotEmpty()
  password: string;
}

export class CreateBelajarDto extends OmitType(BelajarDto, ['id']) {}
