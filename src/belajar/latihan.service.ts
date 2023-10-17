import {
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { NotFoundError, async } from 'rxjs';
import { ResponseSuccess } from 'src/interface/response.interface';

import { InjectRepository } from '@nestjs/typeorm';
import { Belajar } from './belajar.entity';
import { Any, Repository } from 'typeorm';
import { promises } from 'dns';
import { CreateBelajarDto } from './belajar.dto';

@Injectable()
export class LatihanService {
  constructor(
    @InjectRepository(Belajar)
    private readonly belajarRepository: Repository<Belajar>,
  ) {}

  async createBelajar(payload: CreateBelajarDto): Promise<ResponseSuccess> {
    const { username, email, password } = payload;
    try {
      const belajarSave = await this.belajarRepository.save({
        username: username,
        email: email,
        password: password,
      });

      return {
        status: 'Success',
        message: 'Berhasil menambakan buku',
        data: belajarSave,
      };
    } catch (err) {
      throw new HttpException('Ada Kesalahan', HttpStatus.BAD_REQUEST);
    }
  }
}
