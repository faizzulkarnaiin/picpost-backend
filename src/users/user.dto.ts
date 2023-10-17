import { IsInt, IsNotEmpty, Min, Max, Length, IsNumber, IsEmail, ValidateNested, IsArray, ArrayNotEmpty, IsDate, IsOptional,  } from 'class-validator';
import { OmitType, PickType } from '@nestjs/mapped-types';
import { Type } from 'class-transformer';
import { PageRequestDto } from 'src/utils/dto/page.dto';

export class UserDto {
  @IsNumber()
  id: number;

  @IsNotEmpty() 
  @Length(4, 16) 
  nama: string;
  @IsEmail()
  email: string

  @IsInt() 
  umur: number;
  
  @IsNotEmpty()
  tanggal_lahir: string; 

  @IsNotEmpty()
  status: string;
}

export class CreateUserDto extends OmitType(UserDto, ['id']) {}
export class UpdateUserDto extends PickType(UserDto, ['nama', 'email', 'umur','tanggal_lahir', 'status' ]) {}
export class DeleteUserDto extends PickType(UserDto,  ['id'] ) {}
export class DetailUserDto extends PickType(UserDto,  ['id'] ) {} 
export class createUserArrayDto {
  @IsArray()
  @ValidateNested()
  @Type(()=> CreateUserDto)
  data:CreateUserDto[];
}
export class deleteUserArrayDto {
  @IsArray()
  @ArrayNotEmpty() 
  delete: number[];
}

export class FindUserDto extends PageRequestDto {
  @IsOptional()
  nama: string;

  @IsOptional()
  email: string;

  @IsOptional()
  umur: number;

  @IsOptional()
  @IsInt()
  @Type(() => Number)
  from_tanggal_lahir: number;

  @IsOptional()
  @IsInt()
  @Type(() => Number)
  to_tanggal_lahir: number;
}
