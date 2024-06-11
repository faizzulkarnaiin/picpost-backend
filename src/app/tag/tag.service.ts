import {
  HttpException,
  HttpStatus,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Tag } from './tag.entity';
import { Like, Repository } from 'typeorm';
import BaseResponse from 'src/utils/response/base.response';
import { CreateTag, findAllTag } from './tag.dto';
import { ResponsePagination, ResponseSuccess } from 'src/interface';
import { REQUEST } from '@nestjs/core';

@Injectable()
export class TagService extends BaseResponse {
  constructor(
    @InjectRepository(Tag) private readonly tagRepository: Repository<Tag>,
    @Inject(REQUEST) private req: any,
  ) {
    super();
  }

  async create(payload: CreateTag): Promise<ResponseSuccess> {
    try {
      const dataSave = await this.tagRepository.save({
        ...payload,
        created_by: {
          id: this.req.user.id,
        },
      });
      return this._success('OK', dataSave);
      //   a(dataSave);
    } catch (error) {
      throw new HttpException(
        `Ada Kesalahan ${error}`,
        HttpStatus.UNPROCESSABLE_ENTITY,
      );
    }
  }

  async getTag(query: findAllTag): Promise<ResponsePagination> {
    // const userId = this.req.user.id;
    const { page, pageSize, limit, keyword } = query;

    const filterKeyword = [];
    if (keyword) {
      filterKeyword.push({
        name: Like(`%${keyword}%`),
      });
    }
    const total = await this.tagRepository.count({
      where: filterKeyword,
    });
    const result = await this.tagRepository.find({
      where: filterKeyword,
      skip: limit,
      take: pageSize,
    });
    return this._pagination('OK', result, total, page, pageSize);
  }
  async getDetailById(id: number): Promise<ResponseSuccess> {
    try {
      const data: any = await this.tagRepository.findOne({
        where: {
          id: id,
        },
      });
      if (data === null) {
        throw new NotFoundException(`Tag dengan id ${id} tidak ditemukan`);
      }

      return this._success('OK', data);
    } catch (error) {
      console.log(error);
      return error;
    }
  }
}
