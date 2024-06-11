import { OmitType, PartialType, PickType } from '@nestjs/mapped-types';
import {
  IsBoolean,
  IsEmail,
  IsIn,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  Length,
  MinLength,
} from 'class-validator';
import { Gender, User } from './auth.entity';
import { PageRequestDto } from 'src/utils/dto/page.dto';

export class UserDto {
  @IsInt()
  id: number;

  @IsString()
  nama: string;
  @IsString()
  client_id: string;
  @IsString()
  provider: string;

  @IsString()
  avatar: string;
  @IsString()
  bio: string;
  @IsString()
  nama_lengkap: string;
  @IsString()
  @IsNotEmpty()
  @IsIn([Gender.FEMALE, Gender.MALE])
  gender: Gender;

  @IsString()
  @IsEmail()
  email: string;

  @IsString()
  @MinLength(8)
  password: string;

  @IsString()
  refresh_token: string;

  @IsString()
  role: string;
  @IsBoolean()
  isBanned: boolean;
}

export class RegisterDto extends PickType(UserDto, [
  'nama',
  'email',
  'password',
  'provider',
  'role',
]) {}
export class LoginDto extends PickType(UserDto, ['email', 'password']) {}

export class ResetPasswordDto {
  @IsString()
  @MinLength(8)
  new_password: string;
}
export class GithubDto extends PickType(UserDto, [
  'nama',
  'email',
  'client_id',
  'avatar',
  'provider',
]) {}
export class GoogleDto extends PickType(UserDto, [
  'nama',
  'email',
  'client_id',
  'avatar',
  'provider',
]) {}
export class UpdateUserDto extends PickType(UserDto, [
  'nama',
  'avatar',
  'id',
  'bio',
  'nama_lengkap',
  'gender',
]) {}

export class FindAllUser extends PageRequestDto {
  @IsString()
  @IsOptional()
  keyword: string;
}

export class BanUserDto extends PickType(UserDto, ['isBanned']) {}
