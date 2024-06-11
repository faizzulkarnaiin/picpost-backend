import { OmitType } from '@nestjs/mapped-types';
import { IsInt, IsObject, IsOptional, IsString } from 'class-validator';
import { PageRequestDto } from 'src/utils/dto/page.dto';

export class SavePostDto {
  @IsInt()
  @IsOptional()
  id?: number;

  @IsObject()
  @IsOptional()
  user_id: { id: number };

  @IsObject()
  @IsOptional()
  post_id: { id: number };

  @IsObject()
  @IsOptional()
  created_by: { id: number };
}
export class CreateSavePostDto extends OmitType(SavePostDto, ['id']) {}
export class FindSaveByUser extends PageRequestDto {
  @IsString()
  @IsOptional()
  keyword: string;
}
export class FindSaveByPost extends PageRequestDto {
  @IsString()
  @IsOptional()
  keyword: string;
}

