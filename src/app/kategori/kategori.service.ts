import {
  HttpException,
  HttpStatus,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Kategori } from './kategori.entity';
import { REQUEST } from '@nestjs/core';
import { Like, Repository } from 'typeorm';
import BaseResponse from 'src/utils/response/base.response';
import {
  CreateKategoriArrayDto,
  CreateKategoriDto,
  UpdateKategoriDto,
  deleteKategoriArrayDto,
  findAllKategori,
} from './kategori.dto';
import { ResponsePagination, ResponseSuccess } from 'src/interface';
import { User } from '../auth/auth.entity';

@Injectable()
export class KategoriService extends BaseResponse {
  constructor(
    @InjectRepository(Kategori)
    private readonly kategoriRepository: Repository<Kategori>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @Inject(REQUEST) private req: any,
  ) {
    super();
  }
  async create(payload: CreateKategoriDto): Promise<ResponseSuccess> {
    try {
      await this.kategoriRepository.save(payload);

      return this._success('OK', payload);
    } catch {
      throw new HttpException('Ada Kesalahan', HttpStatus.UNPROCESSABLE_ENTITY);
    }
  }

  async getAllCategory(query: findAllKategori): Promise<ResponsePagination> {
    const { page, pageSize, limit, nama_kategori, nama_user } = query;
    console.log('query', query);
    const filterQuery: any = {};
    if (nama_kategori) {
      filterQuery.nama_kategori = Like(`%${nama_kategori}%`);
    }
    if (nama_user) {
      filterQuery.created_by = {
        nama: Like(`%${nama_user}%`),
      };
    }
    const total = await this.kategoriRepository.count({
      where: filterQuery,
    });
    const result = await this.kategoriRepository.find({
      where: filterQuery,
      relations: ['created_by', 'updated_by'], // relasi yang aka ditampilkan saat menampilkan list kategori
      select: {
        // pilih data mana saja yang akan ditampilkan dari tabel kategoris
        id: true,
        nama_kategori: true,
        created_by: {
          id: true, // pilih field  yang akan ditampilkan dari tabel user
          nama: true,
        },
        updated_by: {
          id: true, // pilih field yang akan ditampilkan dari tabel user
          nama: true,
        },
      },
      skip: limit,
      take: pageSize,
    });

    return this._pagination('OK', result, total, page, pageSize);
  }

  async update(
    id: number,
    payload: UpdateKategoriDto,
  ): Promise<ResponseSuccess> {
    const kategori = await this.kategoriRepository.findOne({
      where: {
        id,
      },
    });

    if (kategori === null) {
      throw new NotFoundException(`Kategori dengan id ${id} tidak ditemukan`);
    }
    const update = await this.kategoriRepository.save({
      ...payload,
      id,
    });
    return this._success('Ok', update);
  }

  async deleteKategori(id: number): Promise<ResponseSuccess> {
    const kategori = await this.kategoriRepository.findOne({
      where: {
        id,
      },
    });
    if (kategori === null) {
      throw new NotFoundException(`Kategori dengan id ${id} tidak ditemukan`);
    }
    const deleteKategori = await this.kategoriRepository.delete(id);
    return this._success(
      `berhasil menghapus kategori dengan id ${id}`,
      kategori,
    );
  }

  async getDetail(id: number): Promise<ResponseSuccess> {
    const kategori = await this.kategoriRepository.findOne({
      where: {
        id,
      },
    });
    if (kategori === null) {
      throw new NotFoundException(`Kategori dengan id ${id} Tidak Ditemukan`);
    }
    return this._success(
      `Berhasil menemukan kategori dengan id ${id}`,
      kategori,
    );
  }

  async bulkCreate(payload: CreateKategoriArrayDto): Promise<ResponseSuccess> {
    try {
      let berhasil = 0;
      let gagal = 0;
      await Promise.all(
        payload.data.map(async (item) => {
          try {
            await this.kategoriRepository.save(item);
            berhasil += 1;
          } catch {
            gagal += 1;
          }
        }),
      );
      return this._success(
        `Berhasil Menambahkan Kategori sebanyak ${berhasil} dan gagal sebanyak ${gagal}`,
        payload,
      );
    } catch (error) {
      throw new HttpException('Ada Kesalahan', HttpStatus.BAD_REQUEST, error);
    }
  }
  async bulkDelete(payload: deleteKategoriArrayDto): Promise<ResponseSuccess> {
    try {
      let berhasil = 0;
      let gagal = 0;
      await Promise.all(
        payload.delete.map(async (item) => {
          try {
            await this.kategoriRepository.delete(item);
            berhasil += 1;
          } catch {
            gagal += 1;
          }
        }),
      );
      return this._success(
        `Berhasil menghapus Kategori sebanyak ${berhasil} dan gagal sebanyak ${gagal}`,
        payload,
      );
    } catch {
      throw new HttpException('Ada Kesalahan', HttpStatus.BAD_REQUEST);
    }
  }
  async getUserCategory(): Promise<ResponseSuccess> {
    const user = await this.userRepository.findOne({
      where: {
        id: this.req.user.id,
      },
      relations: ['kategori_created_by', 'kategori_updated_by'],
      select: {
        id: true,
        nama: true,
        kategori_created_by: {
          id: true,
          nama_kategori: true,
        },
      },
    });
    return this._success('ok', user);
  }
}
