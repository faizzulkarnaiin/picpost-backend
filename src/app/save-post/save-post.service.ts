import {
  HttpException,
  HttpStatus,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { REQUEST } from '@nestjs/core';
import { InjectRepository } from '@nestjs/typeorm';
import BaseResponse from 'src/utils/response/base.response';
import { Repository } from 'typeorm';
import { savePost } from './savePost.entity';
import { ResponsePagination, ResponseSuccess } from 'src/interface';
import { CreateSavePostDto, FindSaveByUser } from './savePost.dto';
import { error } from 'console';

@Injectable()
export class SavePostService extends BaseResponse {
  constructor(
    @InjectRepository(savePost)
    private readonly savePostRepository: Repository<savePost>,
    @Inject(REQUEST) private req: any,
  ) {
    super();
  }
  async create(
    id: number,
    payload: CreateSavePostDto,
   
  ): Promise<ResponseSuccess> {
    try {
      const existSave = await this.savePostRepository.findOne({
        where: {
          user_id: {
            id: this.req.user.id,
          },
          post_id: {
            id,
          },
        },
      });
      if (existSave) {
        throw new HttpException(
          'Anda sudah mesave post ini',
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
        created_by: {
          id: this.req.user.id,
        },
      };
      await this.savePostRepository.save(dataSave);

      return this._success(`Berhasil Mengsave post dengan id ${id}`);
    } catch (error) {
      throw new HttpException(
        `Ada Kesalahan ${error}`,
        HttpStatus.UNPROCESSABLE_ENTITY,
      );
    }
  }
  async delete(id: number): Promise<ResponseSuccess> {
    const savePost = await this.savePostRepository.findOne({
      where: {
        id: id,
      },
    });
    if (savePost === null) {
      throw new NotFoundException(`Save dengan id ${id} tidak ditemukan`);
    }
    const deletesavePost = await this.savePostRepository.delete(id);
    return this._success(
      `berhasil menghapus SavePost dengan id ${id}`,
      savePost,
    );
  }
  async getSavePostByUser(query: FindSaveByUser): Promise<ResponsePagination> {
    const { page, pageSize, limit } = query;

    const [getSavePost, totalSave] = await this.savePostRepository.findAndCount(
      {
        where: {
          user_id: { id: this.req.user.id },
          post_id : {
            isBanned : false
          }
          
        },

        relations: ['post_id', 'post_id.images', 'post_id.created_by'],
      },
    );
    return this._pagination('OK', getSavePost, totalSave, page, pageSize);
  }
  
}
