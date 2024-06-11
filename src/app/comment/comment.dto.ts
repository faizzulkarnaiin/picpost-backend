import { OmitType } from '@nestjs/mapped-types';
import { IsInt, IsObject, IsOptional, IsString } from 'class-validator';
import { PageRequestDto } from 'src/utils/dto/page.dto';

export class CommentDto {
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
  @IsString()
  @IsOptional()
  isi_komentar: string;
  @IsObject()
  @IsOptional()
  updated_by: { id: number };
}
export class CreateCommentDto extends OmitType(CommentDto, [
  'id',
  'updated_by',
]) {}
export class FindAllComment extends PageRequestDto {
  @IsString()
  @IsOptional()
  keyword: string;

}
export class FindCommentByPost extends PageRequestDto {
  @IsString()
  @IsOptional()
  keyword: string;

}
