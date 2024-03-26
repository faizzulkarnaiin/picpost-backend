import { OmitType, PartialType, PickType } from '@nestjs/mapped-types';
import { IsEmail, IsInt, IsString, Length, MinLength } from 'class-validator';

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
  @IsEmail()
  email: string;

  @IsString()
  @MinLength(8)
  password: string;

  @IsString()
  refresh_token: string;

  @IsString()
  role: string;
}

export class RegisterDto extends PickType(UserDto, [
  'nama',
  'email',
  'password',
  'provider',
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
]) {}
