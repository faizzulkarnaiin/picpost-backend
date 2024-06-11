import {
  HttpException,
  HttpStatus,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Like, Repository } from 'typeorm';
import { Comment } from './comment.entity';
import { REQUEST } from '@nestjs/core';
import BaseResponse from 'src/utils/response/base.response';
import {
  CreateCommentDto,
  FindAllComment,
  FindCommentByPost,
} from './comment.dto';
import { ResponsePagination, ResponseSuccess } from 'src/interface';
import { filter, take } from 'rxjs';

@Injectable()
export class CommentService extends BaseResponse {
  constructor(
    @InjectRepository(Comment)
    private readonly commentRepository: Repository<Comment>,
    @Inject(REQUEST) private req: any,
  ) {
    super();
  }

  async createComment(
    payload: CreateCommentDto,
    id: number,
  ): Promise<ResponseSuccess> {
    try {
      const dataSave = await this.commentRepository.save({
        ...payload,
        post_id: {
          id: id,
        },
        // user_id: {
        //   id: this.req.user.id,
        //   nama: this.req.user.nama,
        // },
        created_by: {
          id: this.req.user.id,
          nama: this.req.user.nama,
        },
      });
      return this._success('Ok', dataSave);
    } catch (error) {
      console.log(error);
      throw new HttpException('Ada Kesalahan', HttpStatus.UNPROCESSABLE_ENTITY);
    }
  }

  async findAllComment(query: FindAllComment): Promise<ResponsePagination> {
    const { keyword, page, pageSize, limit } = query;
    const filterKeyword = [];
    if (keyword) {
      filterKeyword.push({
        isi_komentar: Like(`%${keyword}%`),
      });
    }
    const total = await this.commentRepository.count({
      where: filterKeyword,
    });
    const result = await this.commentRepository.find({
      where: filterKeyword,
      relations: ['created_by', 'updated_by'],
      select: {
        id: true,
        isi_komentar: true,
        created_at: true,
        updated_at: true,
        created_by: {
          id: true,
          nama: true,
        },
        updated_by: {
          id: true,
          nama: true,
        },
      },
      skip: limit,
      take: pageSize,
    });
    return this._pagination('OK', result, total, page, pageSize);
  }
  async deleteComment(id: number): Promise<ResponseSuccess> {
    const comment = await this.commentRepository.findOne({
      where: {
        id,
      },
    });
    if (comment == null) {
      throw new NotFoundException(`Comment dengan id ${id} tidak ditemukan`);
    }
    const deleteComment = await this.commentRepository.delete(id);
    return this._success(`berhasil menghapus Comment dengan id ${id}`, comment);
  }
  async getCommentByPost(
    query: FindCommentByPost,
    id: number,
  ): Promise<ResponsePagination> {
    const { page, pageSize, limit } = query;
    const [comments, totalComments] = await this.commentRepository.findAndCount(
      {
        where: {
          post_id: {
            id: id,
          },
        },
        relations: ['post_id', 'created_by'],
        skip: limit,
        take: pageSize,
      },
    );
    return this._pagination('OK', comments, totalComments, page, pageSize);
  }
}
