import {
  HttpException,
  HttpStatus,
  Inject,
  Injectable,
  NotFoundException,
  UseGuards,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Following } from './following.entity';
import { Repository } from 'typeorm';
import { REQUEST } from '@nestjs/core';
import { CreateFollowingDto, FindAllFollowed } from './following.dto';
import { ResponsePagination, ResponseSuccess } from 'src/interface';
import BaseResponse from 'src/utils/response/base.response';
import { IsNotSelfFollowGuard } from 'src/utils/decorator/isNotFollow.decorator';
import { JwtGuard } from '../auth/auth.guard';
import { Followers } from '../followers/followers.entity';
@Injectable()
export class FollowingService extends BaseResponse {
  constructor(
    @InjectRepository(Following)
    private readonly followingRepository: Repository<Following>,
    @InjectRepository(Followers)
    private readonly followersRepository: Repository<Followers>,
    @Inject(REQUEST) private req: any,
  ) {
    super();
  }
  async canFollow(followerId: number, followingId: number): Promise<boolean> {
    if (followerId === followingId) {
      throw new HttpException(
        'Tidak dapat mengikuti diri sendiri',
        HttpStatus.BAD_REQUEST,
      );
    }

    const existingFollow = await this.followingRepository.findOne({
      where: { follower: { id: followerId }, followed: { id: followingId } },
    });

    return !existingFollow; // Jika tidak ada, maka bisa follow
  }

  async createFollowing1(id: number): Promise<ResponseSuccess> {
    try {
      const followerId = this.req.user.id;
      const canFollow = await this.canFollow(followerId, id);

      if (!canFollow) {
        throw new HttpException(
          'Anda sudah mengikuti pengguna ini',
          HttpStatus.BAD_REQUEST,
        );
      }

      const dataSave = {
        follower: { id: followerId },
        followed: { id },
      };
      await this.followingRepository.save(dataSave);
      await this.followersRepository.save(dataSave);

      return this._success('OK', dataSave);
    } catch (error) {
      console.log(error);
      throw new HttpException(
        `Ada Kesalahan ${error}`,
        HttpStatus.UNPROCESSABLE_ENTITY,
      );
    }
  }

  async getFollowingByUserId(
    query: FindAllFollowed,
  ): Promise<ResponsePagination> {
    const { page, pageSize, limit } = query;
    const followedCount = await this.followersRepository.count({
      where: { follower: { id: this.req.user.id } },
    });
    const [getUser, totalFollowed] =
      await this.followingRepository.findAndCount({
        where: { follower: { id: this.req.user.id } },
        relations: ['followed'],
        select: {
          id: true,
          followed: {
            nama: true,
            id: true,
            avatar: true,
            email: true,
          },
        },
        skip: limit,
        take: pageSize,
      });
    const followedWithCount = getUser.map((followed) => ({
      ...followed,
      followedCount: getUser.length,
    }));
    return this._pagination(
      'OK',
      followedWithCount,
      totalFollowed,
      page,
      pageSize,
    );
  }
  async getFollowingByUser(
    query: FindAllFollowed,
    id: number,
  ): Promise<ResponsePagination> {
    const { page, pageSize, limit } = query;
    const followedCount = await this.followersRepository.count({
      where: { follower: { id: id } },
    });
    const [getUser, totalFollowed] =
      await this.followingRepository.findAndCount({
        where: { follower: { id: id } },
        relations: ['followed'],
        select: {
          id: true,
          followed: {
            nama: true,
            id: true,
            avatar: true,
            email: true,
          },
        },
        skip: limit,
        take: pageSize,
      });
    const isFollowed = await this.followingRepository.findOne({
      where: {
        follower: {
          id: this.req.user.id,
        },
        followed: {
          id: id,
        },
      },
    });
    const followedWithCount: any = getUser.map((followed) => ({
      ...followed,
      followedCount,
      isFollowed : !!isFollowed,
      followingId : isFollowed ? isFollowed.id : null,
    }));

    return this._pagination(
      'OK',
      followedWithCount,
      totalFollowed,
      page,
      pageSize,
    );
  }
  async deleteFollow(id: number): Promise<ResponseSuccess> {
    const follow = await this.followingRepository.findOne({
      where: {
        id: id,
      },
    });
    if (follow === null) {
      throw new NotFoundException(`Follow dengan id ${id} tidak ditemukan`);
    }
    const deleteLike1 = await this.followingRepository.delete(id);
    const deleteLike2 = await this.followersRepository.delete(id);
    return this._success(
      `berhasil menghapus Follow dengan id ${id}`,
      deleteLike1,
    );
  }
}
