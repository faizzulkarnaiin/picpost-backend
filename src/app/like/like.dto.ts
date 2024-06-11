import { OmitType } from "@nestjs/mapped-types";
import { IsInt, IsObject, IsOptional, IsString } from "class-validator";
import { PageRequestDto } from "src/utils/dto/page.dto";

export class LikeDto {
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
export class CreateLikeDto extends OmitType(LikeDto, ['id']) {}
export class FindLikeByuser extends PageRequestDto {
    @IsString()
    @IsOptional()
    keyword: string;
}
export class FindLikeByPostId extends PageRequestDto {
    @IsString()
    @IsOptional()
    keyword: string;
}