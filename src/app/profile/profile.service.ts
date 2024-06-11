import { HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { REQUEST } from '@nestjs/core';
import { InjectRepository } from '@nestjs/typeorm';
import BaseResponse from 'src/utils/response/base.response';
import { Repository } from 'typeorm';
import { Profile } from './profile.entity';
import { CreateProfileDto } from './profile.dto';
import { ResponseSuccess } from 'src/interface';

@Injectable()
export class ProfileService extends BaseResponse {
  constructor(
    @InjectRepository(Profile)
    private readonly profileRepository: Repository<Profile>,
    @Inject(REQUEST) private req: any,
  ) {
    super();
  }

  async createProfile(payload: CreateProfileDto): Promise<ResponseSuccess> {
    try {
      await this.profileRepository.save({
        ...payload,
        created_by: {
          id: this.req.user.id,
          nama: this.req.user.nama,
        },
      });
      return this._success('OK', payload);
    } catch (error) {
      console.log(error);
      throw new HttpException('Ada Kesalahan', HttpStatus.UNPROCESSABLE_ENTITY);
    }
  }
  async getProfileByUser(): Promise<ResponseSuccess> {
    const getProfile = await this.profileRepository.find({
      where: {
        user_id: {
          id: this.req.user.id,
        },
      },
      select: {
        bio: true,
        fullName: true,
        email: true,
        gender: true,
        id: true,
        phone_number: true,
      },
      relations: ['user_id'],
    });
    return this._success('OK', getProfile);
  }
}
