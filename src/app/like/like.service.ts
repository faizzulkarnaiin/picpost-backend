import {
  HttpException,
  HttpStatus,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Like } from './like.entity';
import { CreateLikeDto, FindLikeByPostId, FindLikeByuser } from './like.dto';
import { ResponsePagination, ResponseSuccess } from 'src/interface';
import { REQUEST } from '@nestjs/core';
import BaseResponse from 'src/utils/response/base.response';
import { error } from 'console';

@Injectable()
export class LikeService extends BaseResponse {
  constructor(
    @InjectRepository(Like)
    private likeRepository: Repository<Like>,
    @Inject(REQUEST) private req: any,
  ) {
    super();
  }
  async create(id: number, payload: CreateLikeDto): Promise<ResponseSuccess> {
    try {
      const existingLikee = await this.likeRepository.findOne({
        where: {
          user_id: {
            id: this.req.user.id,
          },
          post_id: { id },
        },
      });
      if (existingLikee) {
        throw new HttpException(
          'Anda sudah melakukan like pada postingan ini.',
          HttpStatus.BAD_REQUEST,
        );
      }
      const dataSave = {
        ...payload,

        post_id: {
          id: id,
        },

        user_id: {
          id: this.req.user.id,
        },
      };
      await this.likeRepository.save(dataSave);

      return this._success(`Berhasil Menambahkan Like dengan post id ${id}`);
    } catch (error) {
      throw new HttpException(
        `Ada Kesalahan ${error}`,
        HttpStatus.UNPROCESSABLE_ENTITY,
      );
    }
  }

  async deleteLike(id: number): Promise<ResponseSuccess> {
    const like = await this.likeRepository.findOne({
      where: {
        id: id,
      },
    });
    if (like === null) {
      throw new NotFoundException(`Like dengan id ${id} tidak ditemukan`);
    }
    const deleteLike = await this.likeRepository.delete(id);
    return this._success(`berhasil menghapus Like dengan id ${id}`, like);
  }

  async getLikeByUser(query: FindLikeByuser): Promise<ResponsePagination> {
    const { page, pageSize, limit } = query;

    const [getLike, totalLike] = await this.likeRepository.findAndCount({
      where: {
        user_id: { id: this.req.user.id },
        post_id: {
          isBanned: false,
        },
      },
      take: pageSize,
      skip: limit,
      relations: ['user_id', 'post_id', 'post_id.images', 'post_id.created_by'],
      select: {
        user_id: {
          nama: true,
          id: true,
          avatar: true,
        },
        post_id: {
          images: true,
          likes: true,
          id: true,
          judul: true,
          konten: true,
          isBanned: true,
        },
      },
    });
    return this._pagination('OK', getLike, totalLike, page, pageSize);
  }
  async getLikeByPost(
    query: FindLikeByPostId,
    id: number,
  ): Promise<ResponsePagination> {
    const { page, pageSize, limit } = query;
    const [likes, totallikes] = await this.likeRepository.findAndCount({
      where: {
        post_id: {
          id: id,
        },
      },

      relations: ['post_id', 'post_id.created_by', 'post_id.images'],
      skip: limit,
      take: pageSize,
    });

    return this._pagination('OK', likes, totallikes, page, pageSize);
  }
}
