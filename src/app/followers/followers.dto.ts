import { IsOptional, IsString } from 'class-validator';
import { PageRequestDto } from 'src/utils/dto/page.dto';

export class FindFollowersByUser extends PageRequestDto {
  @IsString()
  @IsOptional()
  keyword: string;
}
