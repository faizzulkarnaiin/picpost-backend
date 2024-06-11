import { Inject, Injectable } from '@nestjs/common';
import { REQUEST } from '@nestjs/core';
import { InjectRepository } from '@nestjs/typeorm';
import BaseResponse from 'src/utils/response/base.response';
import { Followers } from './followers.entity';
import { Repository } from 'typeorm';
import { ResponsePagination, ResponseSuccess } from 'src/interface';
import { FindFollowersByUser } from './followers.dto';

@Injectable()
export class FollowersService extends BaseResponse {
  constructor(
    @InjectRepository(Followers)
    private readonly followersRepository: Repository<Followers>,
    @Inject(REQUEST) private req: any,
  ) {
    super();
  }
  async getFollowerByUserId(
    query: FindFollowersByUser,
  ): Promise<ResponsePagination> {
    const userId = this.req.user.id;
    const { page, pageSize, limit } = query;

    const followerCount = await this.followersRepository.count({
      where: { followed: { id: userId } },
    });

    // Mendapatkan daftar pengikut pengguna
    const [followers, totalFollowers] =
      await this.followersRepository.findAndCount({
        where: { followed: { id: userId } },
        relations: ['follower'],
        select: {
          id: true,
          follower: {
            nama: true,
            id: true,
            avatar: true,
            email: true,
          },
        },
        skip: limit,
        take: pageSize,
      });
    // Menambahkan jumlah pengikut ke setiap entitas pengikut
    const followerWithCount = followers.map((followed) => ({
      ...followed,
      followerCount,
    }));

    return this._pagination(
      'OK',
      followerWithCount,
      totalFollowers,
      page,
      pageSize,
    );
  }
  async getFollowerByUser(
    query: FindFollowersByUser,
    id : number
  ): Promise<ResponsePagination> {
    // const userId = this.req.user.id;
    const { page, pageSize, limit } = query;

    const followerCount = await this.followersRepository.count({
      where: { followed: { id: id } },
    });

    // Mendapatkan daftar pengikut pengguna
    const [followers, totalFollowers] =
      await this.followersRepository.findAndCount({
        where: { followed: { id: id } },
        relations: ['follower'],
        select: {
          id: true,
          follower: {
            nama: true,
            id: true,
            avatar: true,
            email: true,
          },
        },
        skip: limit,
        take: pageSize,
      });
    // Menambahkan jumlah pengikut ke setiap entitas pengikut
    const followerWithCount = followers.map((followed) => ({
      ...followed,
      followerCount,
    }));

    return this._pagination(
      'OK',
      followerWithCount,
      totalFollowers,
      page,
      pageSize,
    );
  }
}
