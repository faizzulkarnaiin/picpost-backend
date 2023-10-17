import {
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { NotFoundError } from 'rxjs';
import { ResponseSuccess } from 'src/interface/response.interface';
import { Between, Like, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './user.entity';
import { stat } from 'fs';
import {
  FindUserDto,
  UpdateUserDto,
  createUserArrayDto,
  deleteUserArrayDto,
} from './user.dto';
import BaseResponse from 'src/utils/response/base.response';
@Injectable()
export class UsersService extends BaseResponse {
  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
  ) {
    super()
  }
  private users: {
    id: number;
    nama: string;
    email: string;
    umur: number;
    tanggal_lahir: string;
    status: string;
  }[] = [
    {
      id: 3,
      nama: 'faiz',
      email: 'faiz@gmail.com',
      umur: 15,
      tanggal_lahir: '01/2/07',
      status: 'cikadap',
    },
    {
      id: 2,
      nama: 'tatum',
      email: 'tatum@gmail.com',
      umur: 25,
      tanggal_lahir: '05/3/08',
      status: 'ireng',
    },
  ];
  async getAllUsers(findUser: FindUserDto): Promise<ResponseSuccess> {
    const {
      page,
      pageSize,
      nama,
      email,
      umur,
      from_tanggal_lahir,
      to_tanggal_lahir,
      limit,
    } = findUser;
    const filter: {
      [key: string]: any;
    } = {};

    if (nama) {
      filter.nama = Like(`%${nama}%`);
    }
    if (email) {
      filter.email = Like(`%${email}%`);
    }

    if (from_tanggal_lahir && to_tanggal_lahir) {
      filter.tanggal_lahir = Between(from_tanggal_lahir, to_tanggal_lahir);
    }

    if (from_tanggal_lahir && !!to_tanggal_lahir === false) {
      filter.tanggal_lahir = Between(from_tanggal_lahir, from_tanggal_lahir);
    }
    const total = await this.userRepository.count({
      where: filter,
    });
    const user = await this.userRepository.find({
      where: filter,
      skip: limit,
      take: pageSize,
    });
    return this._pagination('ok', user, total, page, pageSize)
  }

  async createUser(payload: any): Promise<ResponseSuccess> {
    const { nama, email, umur, tanggal_lahir, status } = payload;

    try {
      const userSave = await this.userRepository.save({
        nama: nama,
        email: email,
        umur: umur,
        tanggal_lahir: tanggal_lahir,
        status: status,
      });

      return {
        status: 'Success',
        message: 'Berhasil menambakan user',
        data: userSave,
      };
    } catch (err) {
      throw new HttpException('Ada Kesalahan', HttpStatus.BAD_REQUEST);
    }
  }

  async updateUser(
    id: number,
    payload: UpdateUserDto,
  ): Promise<ResponseSuccess> {
    const { nama, email, umur, tanggal_lahir, status } = payload;
    const user = await this.userRepository.findOne({
      where: {
        id,
      },
    });

    if (user === null) {
      throw new NotFoundException(`Buku dengan id ${id} Tidak Ditemukan`);
    }

    const update = await this.userRepository.save({ ...payload, id });

    return {
      status: 'ok',
      message: 'berhasil mengupdate user',
      data: update,
    };
  }

  async deleteUser(id: number): Promise<ResponseSuccess> {
    const user = await this.userRepository.findOne({ where: { id } });

    if (user === null) {
      throw new NotFoundException(
        `User dengan id ${id} Tidak dapat ditemukan `,
      );
    }
    const deleteUser = await this.userRepository.delete(id);

    return {
      status: 'ok',
      message: 'berhasil mendelete User',
      data: user,
    };
  }
  private findUserById(id: number) {
    // mencari index dari buku berdasarkan id
    const userIndex = this.users.findIndex((user) => user.id === id);

    if (userIndex === -1) {
      throw new NotFoundException(`user dengan id ${id} tidak ditemukan`);
    }
    return userIndex;
  }

  async getDetail(id: number): Promise<ResponseSuccess> {
    const user = await this.userRepository.findOne({
      where: {
        id,
      },
    });

    if (user === null) {
      throw new NotFoundException(`Buku dengan id ${id} Tidak Ditemukan`);
    }

    return {
      status: 'ok',
      message: 'berhasil mendapatkan buku',
      data: user,
    };
  }

  async bulkCreate(payload: createUserArrayDto): Promise<ResponseSuccess> {
    try {
      let berhasil = 0;
      let gagal = 0;
      await Promise.all(
        payload.data.map(async (item) => {
          try {
            await this.userRepository.save(item);
            berhasil += 1;
          } catch {
            gagal += 1;
          }
        }),
      );
      return {
        status: 'ok',
        message: `Berhasil menambahkan user sebanyak ${berhasil} dan gagal sebanyak ${gagal}`,
        data: payload,
      };
    } catch {
      throw new HttpException('Ada Kesalahan', HttpStatus.BAD_REQUEST);
    }
  }

  async bulkDelete(payload: deleteUserArrayDto): Promise<ResponseSuccess> {
    try {
      let berhasil = 0;
      let gagal = 0;
      await Promise.all(
        payload.delete.map(async (item) => {
          try {
            await this.userRepository.delete(item);
            berhasil += 1;
          } catch {
            gagal += 1;
          }
        }),
      );
      return {
        status: 'ok',
        message: `Berhasil menghapus user sebanyak ${berhasil} dan gagal sebanyak ${gagal}`,
        data: payload,
      };
    } catch {
      throw new HttpException('Ada Kesalahan', HttpStatus.BAD_REQUEST);
    }
  }
}
