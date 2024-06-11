import { OmitType, PickType } from '@nestjs/mapped-types';
import {
  IsArray,
  IsBoolean,
  IsInt,
  IsObject,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';
import { PageRequestDto } from 'src/utils/dto/page.dto';
import { CreateImageDto } from '../image/image.dto';
import { Type } from 'class-transformer';
import { CreateTag } from '../tag/tag.dto';

export class PostDto {
  @IsInt()
  id?: number;
  @IsString()
  judul: string;
  @IsBoolean()
  isBanned: boolean;
  @IsString()
  konten: string;
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateImageDto)
  images: CreateImageDto[];
  @IsObject()
  @IsOptional()
  created_by: { id: number };

  @IsObject()
  @IsOptional()
  updated_by: { id: number };
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateTag)
  tags: CreateTag[];
}

export class CreatePostDto extends OmitType(PostDto, ['id', 'updated_by', 'isBanned']) {}
export class UpdatePostDto extends OmitType(PostDto, ['id', 'created_by', 'isBanned']) {}
export class BanPostDto extends OmitType(PostDto, ['id', 'created_by', 'images', 'judul', 'konten', 'tags', 'updated_by']) {}

export class FindAllPost extends PageRequestDto {
  @IsString()
  @IsOptional()
  keyword: string;
  @IsString()
  @IsOptional()
  judul: string;
  @IsInt()
  @IsOptional()
  tagId?: number;
}
