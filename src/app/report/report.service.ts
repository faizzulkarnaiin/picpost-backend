import {
  HttpException,
  HttpStatus,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import BaseResponse from 'src/utils/response/base.response';
import { ReportPost } from './report.entity';
import { Repository } from 'typeorm';
import { REQUEST } from '@nestjs/core';
import { CreateReportPostDto, FindReport } from './report.dto';
import { ResponsePagination, ResponseSuccess } from 'src/interface';
import { take } from 'rxjs';

@Injectable()
export class ReportService extends BaseResponse {
  constructor(
    @InjectRepository(ReportPost)
    private readonly reportRepository: Repository<ReportPost>,
    @Inject(REQUEST) private req: any,
  ) {
    super();
  }

  async create(
    id: number,
    payload: CreateReportPostDto,
  ): Promise<ResponseSuccess> {
    try {
      const dataSave = {
        ...payload,
        created_by: {
          id: this.req.user.id,
        },
        post_id: {
          id,
        },
      };
      await this.reportRepository.save(dataSave);
      return this._success('OK', dataSave);
    } catch (error) {
      console.log(error);
      throw new HttpException(
        `Ada Kesalahan ${error}`,
        HttpStatus.UNPROCESSABLE_ENTITY,
      );
    }
  }
  async findAll(query: FindReport): Promise<ResponsePagination> {
    const { page, pageSize, limit, keyword } = query;
    const filterKeyword: any = [];
    const total = await this.reportRepository.count({
      where: filterKeyword,
    });
    const result = await this.reportRepository.find({
      where: filterKeyword,
      relations: ['post_id', 'created_by', 'post_id.created_by'],
      select: {
        id: true,
        alasan: true,
        created_at : true,
        created_by:  {
          id: true,
          nama: true,
          avatar: true,
        },
        post_id: {
          id: true,
          judul: true,
          konten: true,
          images: true,
          isBanned : true,
          created_by: {
            nama: true,
            id: true,
            avatar: true,
          },
        },
      },
      skip: limit,
      take: pageSize,
    });
    return this._pagination('ok', result, total, page, pageSize);
  }
  async deleteRepoert(id: number): Promise<ResponseSuccess> {
    const report = await this.reportRepository.findOne({
      where: {
        id,
      },
    });
    if (report === null) {
      throw new NotFoundException(`Report dengan id ${id} tidak ditemukan`);
    }
    const deleteKategori = await this.reportRepository.delete(id);
    return this._success(`berhasil menghapus Report dengan id ${id}`, report);
  }
}
