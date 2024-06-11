import {
  IsEnum,
  IsIn,
  IsInt,
  IsNotEmpty,
  IsObject,
  IsOptional,
  IsString,
} from 'class-validator';
import { Gender } from './profile.entity';
import { OmitType } from '@nestjs/mapped-types';

export class ProfileDdto {
  @IsInt()
  id?: number;
  @IsString()
  fullname: string;
  @IsString()
  bio: string;
  @IsString()
  email: string;
  @IsString()
  phone_number: string;
  @IsString()
  @IsNotEmpty()
  @IsIn([Gender.FEMALE, Gender.MALE])
  gender: Gender;
  @IsObject()
  @IsOptional()
  created_by: { id: number };
}
export class CreateProfileDto extends OmitType(ProfileDdto, ['id']) {}
