import {
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Mobil } from './mobil.entity';
import { Between, Like, Repository } from 'typeorm';
import {
  FindMobilDto,
  createAndUpdateMobilDto,
  createMobilArrayDto,
  deleteMobilArrayDto,
} from './mobil.dto';
import { ResponsePagination, ResponseSuccess } from 'src/interface';

@Injectable()
export class MobilService {
  constructor(
    @InjectRepository(Mobil)
    private readonly mobilRepository: Repository<Mobil>,
  ) {}

  async getAllMobils(findBookDto: FindMobilDto) {
    const {
      nama,
      merekMobil,
      tipeMobil,
      from_harga,
      to_harga,
      from_year,
      to_year,
    } = findBookDto;

    const filter: {
      [key: string]: any;
    } = {};

    if (nama) {
      filter.nama = Like(`%${nama}%`);
    }
    if (merekMobil) {
      filter.merekMobil = Like(`%${merekMobil}%`);
    }
    if (tipeMobil) {
      filter.tipeMobil = Like(`%${tipeMobil}%`);
    }

    if (from_year && to_year) {
      filter.year = Between(from_year, to_year);
    }

    if (from_year && !!to_year === false) {
      filter.year = Between(from_year, from_year);
    }
    if (from_harga && to_harga) {
      filter.harga = Between(from_harga, to_harga);
    }

    if (from_harga && !!to_harga === false) {
      filter.harga = Between(from_harga, from_harga);
    }

    const book = await this.mobilRepository.find({
      where: filter,
    });
    return {
      status: 'Success',
      message: 'Berhasil mengambil buku',
      data: book,
    };
  }

  async createMobil(
    payload: createAndUpdateMobilDto,
  ): Promise<ResponseSuccess> {
    const { nama, merekMobil, tipeMobil, harga, tahun } = payload;

    if (!this.isValidMerekAndTipe(merekMobil, tipeMobil)) {
      throw new HttpException(
        'Tipe tidak valid untuk merek',
        HttpStatus.BAD_REQUEST,
      );
    }

    try {
      const mobilSave = await this.mobilRepository.save({
        nama: nama,
        merekMobil: merekMobil,
        tipeMobil: tipeMobil,
        harga: harga,
        tahun: tahun,
      });
      return {
        status: 'Success',
        message: 'Berhasil menambahkan mobil',
        data: mobilSave,
      };
    } catch (err) {
      throw new HttpException('Ada kesalahan', HttpStatus.BAD_REQUEST);
    }
  }

  private isValidMerekAndTipe(merekMobil: string, tipeMobil: string): boolean {
    switch (merekMobil) {
      case 'honda':
        return ['CRV', 'BRV', 'HRV'].includes(tipeMobil);
      case 'toyota':
        return ['Avanza', 'Innova', 'Raize'].includes(tipeMobil);
      case 'suzuki':
        return ['Ertiga', 'XL7', 'Baleno'].includes(tipeMobil);
      default:
        return false;
    }
  }
  async updateMobil(
    id: number,
    payload: createAndUpdateMobilDto,
  ): Promise<ResponseSuccess> {
    const { nama, merekMobil, tipeMobil, harga, tahun } = payload;
    const mobil = await this.mobilRepository.findOne({
      where: {
        id,
      },
    });
    if (mobil === null) {
      throw new NotFoundException(`Mobil dengan id ${id} Tidak Ditemukan`);
    }
    const update = await this.mobilRepository.save({ ...payload, id });
    return {
      status: 'ok',
      message: 'berhasil mengupdate mobil',
      data: update,
    };
  }

  async deleteMobil(id: number): Promise<ResponseSuccess> {
    const mobil = await this.mobilRepository.findOne({
      where: {
        id,
      },
    });
    if (mobil == null)
      throw new NotFoundException(
        `Mobil dengan id ${id} Tidak dapat ditemukan `,
      );

    const deleteBook = await this.mobilRepository.delete(id);
    return {
      status: 'ok',
      message: 'berhasil mendelete Mobil ',
    };
  }

  async getDetail(id: number): Promise<ResponseSuccess> {
    const mobil = await this.mobilRepository.findOne({
      where: {
        id,
      },
    });
    if (mobil === null) {
      throw new NotFoundException(`Mobil dengan id ${id} Tidak Ditemukan`);
    }

    return {
      status: 'ok',
      message: 'berhasil mendapatkan mobil',
      data: mobil,
    };
  }

  async bulkCreate(payload: createMobilArrayDto): Promise<ResponseSuccess> {
    
   
    
    try {
      let berhasil = 0;
      let gagal = 0;
      await Promise.all(
        payload.data.map(async (item) => {
          try {
            await this.mobilRepository.save(item);

            berhasil += 1;
          } catch {
            gagal += 1;
          }
        }),
      );
      return {
        status: 'ok',
        message: `Berhasil menambahkan mobil sebanyak ${berhasil} dan gagal sebanyak ${gagal}`,
        data: payload,
      };
    } catch {
      throw new HttpException('Ada Kesalahan', HttpStatus.BAD_REQUEST);
    }
  }
  private isValidMerekAndTipeBulk(
    merekMobil: string,
    tipeMobil: string,
  ): boolean {
    switch (merekMobil) {
      case 'honda':
        return ['CRV', 'BRV', 'HRV'].includes(tipeMobil);
      case 'toyota':
        return ['Avanza', 'Innova', 'Raize'].includes(tipeMobil);
      case 'suzuki':
        return ['Ertiga', 'XL7', 'Baleno'].includes(tipeMobil);
      default:
        return false;
    }
  }
  async bulkDelete(payload: deleteMobilArrayDto): Promise<ResponseSuccess> {
    try {
      let berhasil = 0;
      let gagal = 0;
      await Promise.all(
        payload.delete.map(async (item) => {
          try {
            await this.mobilRepository.delete(item);
            berhasil += 1;
          } catch {
            gagal += 1;
          }
        }),
      );
      return {
        status: 'ok',
        message: `Berhasil menghapus mobil sebanyak ${berhasil} dan gagal sebanyak ${gagal}`,
        data: payload,
      };
    } catch {
      throw new HttpException('Ada Kesalahan', HttpStatus.BAD_REQUEST);
    }
  }
}
