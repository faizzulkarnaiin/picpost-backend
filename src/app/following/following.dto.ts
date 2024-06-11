import { OmitType } from '@nestjs/mapped-types';
import { IsInt, IsObject, IsOptional, IsString } from 'class-validator';
import { PageRequestDto } from 'src/utils/dto/page.dto';

export class FollowingDto {
  @IsInt()
  @IsOptional()
  id?: number;
  @IsObject()
  @IsOptional()
  follower: { id: number };
  @IsObject()
  @IsOptional()
  followed: { id: number };
}

export class CreateFollowingDto extends OmitType(FollowingDto, ['id']) {}

export class FindAllFollowed extends PageRequestDto {
  @IsString()
  @IsOptional()
  keyword: string;
  @IsString()
  @IsOptional()
  nama_user: string;
}
export class FindAllFollowers extends PageRequestDto {
  @IsString()
  @IsOptional()
  keyword: string;
}
