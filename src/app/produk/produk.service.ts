import {
  HttpException,
  HttpStatus,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Produk } from './produk.entity';
import { Between, Like, Repository } from 'typeorm';
import { REQUEST } from '@nestjs/core';
import BaseResponse from 'src/utils/response/base.response';
import {
  CreateProdukArrayDto,
  DeleteProdukArrayDto,
  UpdateProdukDto,
  findAllProduk,
} from './produk.dto';
import { ResponsePagination, ResponseSuccess } from 'src/interface';

@Injectable()
export class ProdukService extends BaseResponse {
  constructor(
    @InjectRepository(Produk)
    private readonly produkRepository: Repository<Produk>,
    @Inject(REQUEST) private req: any,
  ) {
    super();
  }
  async createBulk(payload: CreateProdukArrayDto): Promise<ResponseSuccess> {
    try {
      let berhasil = 0;
      let gagal = 0;
      await Promise.all(
        payload.data.map(async (data) => {
          const dataSave = {
            ...data,
            kategori: {
              id: data.kategori_id,
            },
            created_by: {
              id: this.req.user.id,
            },
          };

          try {
            await this.produkRepository.save(dataSave);

            berhasil += 1;
          } catch (err) {
            console.log('err', err);
            gagal += 1;
          }
        }),
      );

      return this._success(
        `Berhasil menyimpan ${berhasil} dan gagal ${gagal}`,
        payload,
      );
    } catch (err) {
      console.log('err', err);
      throw new HttpException('Ada Kesalahan', HttpStatus.BAD_REQUEST);
    }
  }
  async findAll(query: findAllProduk): Promise<ResponsePagination> {
    const {
      page,
      pageSize,
      limit,
      nama_produk,
      dari_harga,
      sampai_harga,
      deskripsi_produk,
      keyword,
      nama_kategori,
    } = query;

    const filterQuery: any = {};
    const filterKeyword = [];

    if (keyword) {
      filterKeyword.push(
        {
          nama_produk: Like(`%${keyword}%`),
        },
          {
            kategori: {
              nama_kategori: Like(`%${keyword}%`),
            },
          },
        {
          harga: Like(`%${keyword}%`),
        },
        {
          deskripsi_produk: Like(`%${keyword}%`),
        },
      );
    } else {
      if (deskripsi_produk) {
        filterQuery.deskripsi_produk = Like(`%${deskripsi_produk}%`);
      }
      if (nama_produk) {
        filterQuery.nama_produk = Like(`%${nama_produk}%`);
      }
      if (nama_kategori) {
        filterQuery.kategori = {
          nama_kategori: Like(`%${nama_kategori}%`),
        };
      }
      if (dari_harga && sampai_harga) {
        filterQuery.harga = Between(dari_harga, sampai_harga);
      }
      if (dari_harga && !!sampai_harga === false) {
        filterQuery.harga = Between(dari_harga, dari_harga);
      }
    }

    const total = await this.produkRepository.count({
      where: keyword ? filterKeyword : filterQuery,
    });
    const result = await this.produkRepository.find({
      where: keyword ? filterKeyword : filterQuery,
      relations: ['created_by', 'updated_by', 'kategori'],
      select: {
        id: true,
        nama_produk: true,
        deskripsi_produk: true,
        stok: true,
        harga: true,
        kategori: {
          id: true,
          nama_kategori: true,
        },
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
  async getDetail(id: number): Promise<ResponseSuccess> {
    const produk = await this.produkRepository.findOne({
      where: {
        id,
      },
    });
    if (produk === null) {
      throw new NotFoundException(`Produk dengan id ${id} Tidak Ditemukan`);
    }
    return this._success(`Berhasil menemukan Produk dengan id ${id}`, produk);
  }
  async deleteProduk(id: number): Promise<ResponseSuccess> {
    const produk = await this.produkRepository.findOne({
      where: {
        id,
      },
    });
    if (produk === null) {
      throw new NotFoundException(`Produk dengan id ${id} tidak ditemukan`);
    }
    const deleteProduk = await this.produkRepository.delete(id);
    return this._success(`berhasil menghapus Produk dengan id ${id}`, produk);
  }
  async update(id: number, payload: UpdateProdukDto): Promise<ResponseSuccess> {
    const produk = await this.produkRepository.findOne({
      where: {
        id,
      },
    });

    if (produk === null) {
      throw new NotFoundException(`produk dengan id ${id} tidak ditemukan`);
    }
    const update = await this.produkRepository.save({
      ...payload,
      kategori: {
        id: payload.kategori_id,
        // nama: this.req.user.nama,
      },
      updated_by: {
        id: this.req.user.id,
        name: this.req.user.nama,
      },
      id,
    });
    return this._success('Ok', update);
  }
  async bulkDelete(payload: DeleteProdukArrayDto): Promise<ResponseSuccess> {
    try {
      let berhasil = 0;
      let gagal = 0;
      await Promise.all(
        payload.data.map(async (item) => {
          try {
            const willDelete = await this.produkRepository.findOne({
              where: {
                id: item,
              },
            });

            await this.produkRepository.remove(willDelete);
            berhasil += 1;
          } catch {
            gagal += 1;
          }
        }),
      );
      return this._success(
        `Berhasil menghapus Produk sebanyak ${berhasil} dan gagal sebanyak ${gagal}`,
        payload,
      );
    } catch {
      throw new HttpException('Ada Kesalahan', HttpStatus.BAD_REQUEST);
    }
  }
}
