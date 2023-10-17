import {
    HttpException,
    HttpStatus,
    Injectable,
    NotFoundException,
  } from '@nestjs/common';
  import { NotFoundError, async } from 'rxjs';
  import { ResponseSuccess } from 'src/interface/response.interface';
  
  import { InjectRepository } from '@nestjs/typeorm';

  import { Any, Repository } from 'typeorm';
  import { promises } from 'dns';
import { Nyoba } from './nyoba.entity';
import { CreateNyobaDto } from './nyoba2.dto';

  
  @Injectable()
  export class NyobaService {
    constructor(
      @InjectRepository(Nyoba)
      private readonly belajarRepository: Repository<Nyoba>,
    ) {}
  
    async createNyoba(payload: CreateNyobaDto): Promise<ResponseSuccess> {
      const { username, email, password } = payload;
      try {
        const belajarSave = await this.belajarRepository.save({
          username: username,
          email: email,
          password: password,
        });
  
        return {
          status: 'Success',
          message: 'Berhasil menambakan akun',
          data: belajarSave,
        };
      } catch (err) {
        throw new HttpException('Ada Kesalahan', HttpStatus.BAD_REQUEST);
      }
    }
    // findAll (page:number = 1, pageSize:number = 5) {
    //   const startIndex = (page - 1) * pageSize;
    //   const endIndex = startIndex + pageSize;
    //   const paginatedItems = this.belajarRepository.slice(startIndex, endIndex);
    // }
  }
  