import {
  HttpException,
  HttpStatus,
  Inject,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './auth.entity';
import { Like, MongoNetworkTimeoutError, Repository } from 'typeorm';
import BaseResponse from 'src/utils/response/base.response';
import {
  BanUserDto,
  FindAllUser,
  GithubDto,
  GoogleDto,
  LoginDto,
  RegisterDto,
  ResetPasswordDto,
  UpdateUserDto,
  UserDto,
} from './auth.dto';
import {
  githubJwtPayload,
  googleJwtPayload,
  jwtPayload,
} from './auth.interface';
import { ResponsePagination, ResponseSuccess } from 'src/interface';
import { allowedNodeEnvironmentFlags } from 'process';
import { JwtService } from '@nestjs/jwt';
import { access } from 'fs';
import { jwt_config } from 'src/config/jwt.congif';
import { compare, hash } from 'bcrypt';
import { randomBytes } from 'crypto';
import { MailService } from '../mail/mail.service';
import { ResetPassword } from '../mail/reset_password.entity';
import { constants } from 'buffer';
import { REQUEST } from '@nestjs/core';
import { filter } from 'rxjs';
import { toASCII } from 'punycode';
import { Following } from '../following/following.entity';
@Injectable()
export class AuthService extends BaseResponse {
  constructor(
    @InjectRepository(User) private readonly authRepository: Repository<User>,
    @InjectRepository(Following)
    private readonly followRepository: Repository<Following>,
    @InjectRepository(ResetPassword)
    private readonly resetPasswordRepo: Repository<ResetPassword>,
    private jwtService: JwtService,
    private mailService: MailService,
    @Inject(REQUEST) private req: any,
  ) {
    super();
  }

  private generateJWT(
    payload: jwtPayload,
    expiresIn: string | number,
    token: string,
  ) {
    return this.jwtService.sign(payload, {
      secret: token,
      expiresIn: expiresIn,
    });
  }
  private generateGithubJWT(
    payload: githubJwtPayload,
    expiresIn: string | number,
    token: string,
  ) {
    return this.jwtService.sign(payload, {
      secret: token,
      expiresIn: expiresIn,
    });
  }
  private generateGoogleJWT(
    payload: googleJwtPayload,
    expiresIn: string | number,
    token: string,
  ) {
    return this.jwtService.sign(payload, {
      secret: token,
      expiresIn: expiresIn,
    });
  }

  async register(payload: RegisterDto): Promise<ResponseSuccess> {
    const checkUserExists = await this.authRepository.findOne({
      where: {
        email: payload.email,
      },
    });
    if (checkUserExists) {
      throw new HttpException('User already registered', HttpStatus.FOUND);
    }

    payload.password = await hash(payload.password, 12); //hash password
    await this.authRepository.save({
      ...payload,
      role: 'user',
    });

    return this._success('Register Berhasil', checkUserExists);
  }

  async login(payload: LoginDto): Promise<ResponseSuccess> {
    console.log('pay', payload);
    const checkUserExists = await this.authRepository.findOne({
      where: {
        email: payload.email,
        provider: 'credentials',
      },
      select: {
        id: true,
        nama: true,
        email: true,
        password: true,
        refresh_token: true,
        role: true,
        isBanned : true
      },
    });
    console.log('checkuser', checkUserExists);
    if (!checkUserExists) {
      throw new HttpException(
        'User tidak ditemukan',
        HttpStatus.UNPROCESSABLE_ENTITY,
      );
    }
    console.log(true, 'ddadadad')

    const checkPassword = await compare(
      payload.password,
      checkUserExists.password,
    );
console.log(true, 'dad')
    if (checkPassword) {
      const jwtPayload: jwtPayload = {
        id: checkUserExists.id,
        nama: checkUserExists.nama,
        email: checkUserExists.email,
      };
      console.log(true, 'dad333')

      const access_token = await this.generateJWT(
        jwtPayload,
        '1d',
        process.env.JWT_ACCESS_SECRET,
      );
      console.log(true, 'd2313ad333')

      const refresh_token = await this.generateJWT(
        jwtPayload,
        '7d',
        process.env.JWT_REFRESH_SECRET,
      );
      console.log(true, 'da3131d333')

      await this.authRepository.save({
        refresh_token: refresh_token,
        id: checkUserExists.id,
      });
      console.log(true, 'da33331d333')

      return this._success('Login Success', {
        ...checkUserExists,
        access_token: access_token,
        refresh_token: refresh_token,
        // role: 'admin',
      });
    } else {
      throw new HttpException(
        'email dan password tidak sama',
        HttpStatus.UNPROCESSABLE_ENTITY,
      );
    }
  }
  async loginWithGithub(payload: GithubDto): Promise<ResponseSuccess> {
    try {
      console.log(payload);

      let user = await this.authRepository.findOne({
        where: {
          client_id: payload.client_id,
          provider: 'github',
        },
      });

      // Buat payload JWT
      const githubJwtPayload: githubJwtPayload = {
        id: user ? user.id : null,
        nama: payload.nama,
        email: payload.email,
        client_id: payload.client_id,
      };

      const access_token = await this.generateGithubJWT(
        githubJwtPayload,
        '1d',
        jwt_config.access_token_secret,
      );

      let refresh_token;
      if (user) {
        refresh_token = await this.generateGithubJWT(
          githubJwtPayload,
          '7d',
          jwt_config.refresh_token_secret,
        );

        user.refresh_token = refresh_token;
        await this.authRepository.save(user);
      } else {
        user = await this.authRepository.save(payload);
        refresh_token = await this.generateGithubJWT(
          githubJwtPayload,
          '7d',
          jwt_config.refresh_token_secret,
        );

        user.refresh_token = refresh_token;
        await this.authRepository.save(user);
      }

      return this._success('Login Success', {
        ...payload,
        access_token: access_token,
        refresh_token: refresh_token,
        role: 'siswa',
      });
    } catch (error) {
      throw new HttpException(
        'Gagal login dengan github',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async loginWithGoogle(payload: GoogleDto): Promise<ResponseSuccess> {
    try {
      console.log(payload);

      let user = await this.authRepository.findOne({
        where: {
          client_id: payload.client_id,
          provider: 'google',
        },
      });

      const googleJwtPayload: googleJwtPayload = {
        id: user ? user.id : null,
        nama: payload.nama,
        email: payload.email,
        client_id: payload.client_id,
      };

      const access_token = await this.generateGoogleJWT(
        googleJwtPayload,
        '1d',
        jwt_config.access_token_secret,
      );

      let refresh_token;
      if (user) {
        refresh_token = await this.generateGoogleJWT(
          googleJwtPayload,
          '7d',
          jwt_config.refresh_token_secret,
        );
        user.refresh_token = refresh_token;
        await this.authRepository.save(user);
      } else {
        user = await this.authRepository.save(payload);
        refresh_token = await this.generateGoogleJWT(
          googleJwtPayload,
          '7d',
          jwt_config.refresh_token_secret,
        );
        user.refresh_token = refresh_token;
        await this.authRepository.save(user);
      }

      return this._success('Login Success', {
        ...payload,
        access_token: access_token,
        refresh_token: refresh_token,
        role: 'siswa',
      });
    } catch (error) {
      throw new HttpException(
        'Gagal login dengan Google',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async myProfile(id: number): Promise<ResponseSuccess> {
    const user = await this.authRepository.findOne({
      where: {
        id: id,
      },
    });

    return this._success('OK', user);
  }
  async updateProfile(
    id: number,
    payload: UpdateUserDto,
  ): Promise<ResponseSuccess> {
    const user = await this.authRepository.findOne({
      where: {
        id: id,
      },
    });
    if (user == null) {
      throw new NotFoundException(`User dengan id ${id} tidak ditemukan`);
    }
    // const updateUser = await this.authRepository.save({
    //   ...payload,
    //   id,

    // });
    const update = await this.authRepository.update(
      { id: id },
      {
        ...payload,
      },
    );
    return this._success('OK', update);
  }
  async refreshToken(id: number, token: string): Promise<ResponseSuccess> {
    const checkUserExists = await this.authRepository.findOne({
      where: {
        id,
        refresh_token: token,
      },
      select: {
        id: true,
        nama: true,
        email: true,
        password: true,
        refresh_token: true,
      },
    });

    if (checkUserExists === null) {
      throw new UnauthorizedException();
    }

    const jwtPayload: jwtPayload = {
      id: checkUserExists.id,
      nama: checkUserExists.nama,
      email: checkUserExists.email,
    };

    const access_token = await this.generateJWT(
      jwtPayload,
      '1d',
      jwt_config.access_token_secret,
    );

    const refresh_token = await this.generateJWT(
      jwtPayload,
      '7d',
      jwt_config.refresh_token_secret,
    );

    await this.authRepository.save({
      refresh_token: refresh_token,
      id: checkUserExists.id,
    });

    return this._success('Success', {
      ...checkUserExists,
      access_token: access_token,
      refresh_token: refresh_token,
    });
  }
  async forgotPassword(email: string): Promise<ResponseSuccess> {
    const user = await this.authRepository.findOne({
      where: {
        email: email,
      },
    });

    if (!user) {
      throw new HttpException(
        'Email tidak ditemukan',
        HttpStatus.UNPROCESSABLE_ENTITY,
      );
    }
    const token = randomBytes(32).toString('hex'); // membuat token
    const link = `http://localhost:3000/auth/reset-password/${user.id}/${token}`; //membuat link untuk reset password
    const feLink = `http://localhost:3000/auth/${user.id}/${token}/reset-password`;
    await this.mailService.sendForgotPassword({
      email: email,
      name: user.nama,
      link: link,
      feLink: feLink,
    });

    const payload = {
      user: {
        id: user.id,
      },
      token: token,
    };

    await this.resetPasswordRepo.save(payload); // menyimpan token dan id ke tabel reset password

    return this._success('Silahkan Cek Email');
  }
  async resetPassword(
    user_id: number,
    token: string,
    payload: ResetPasswordDto,
  ): Promise<ResponseSuccess> {
    const userToken = await this.resetPasswordRepo.findOne({
      //cek apakah user_id dan token yang sah pada tabel reset password
      where: {
        token: token,
        user: {
          id: user_id,
        },
      },
    });

    if (!userToken) {
      throw new HttpException(
        'Token tidak valid',
        HttpStatus.UNPROCESSABLE_ENTITY, // jika tidak sah , berikan pesan token tidak valid
      );
    }

    payload.new_password = await hash(payload.new_password, 12); //hash password
    await this.authRepository.save({
      // ubah password lama dengan password baru
      password: payload.new_password,
      id: user_id,
    });
    await this.resetPasswordRepo.delete({
      // hapus semua token pada tabel reset password yang mempunyai user_id yang dikirim, agar tidak bisa digunakan kembali
      user: {
        id: user_id,
      },
    });

    return this._success('Reset Passwod Berhasil, Silahkan login ulang');
  }

  async getAllUser(query: FindAllUser): Promise<ResponsePagination> {
    const { keyword, page, pageSize, limit } = query;
    const filterQuery: any = { role: 'user' };
    if (keyword) {
      filterQuery.nama = Like(`%${keyword}%`);
    }
    const total = await this.authRepository.count({
      where: filterQuery,
    });
    const result = await this.authRepository.find({
      where: filterQuery,
      skip: limit,
      take: pageSize,
    });
    return this._pagination('OK', result, total, page, pageSize);
  }
  async getUserProfile(id: number): Promise<ResponseSuccess> {
    const user: any = await this.authRepository.findOne({
      relations: ['following', 'followers'],
      where: {
        id: id,
      },
    });
    const isFollowed = await this.followRepository.findOne({
      where: {
        follower: {
          id: this.req.user.id,
        },
        followed: {
          id: id,
        },
      },
    });
    user.isFollowed = !!isFollowed;
    user.followingId = isFollowed ? isFollowed.id : null;
    return this._success('OK', user);
  }
  async banUser(id: number, payload: BanUserDto): Promise<ResponseSuccess> {
    const user = await this.authRepository.find({
      where: {
        id: id,
      },
    });
    if (user == null) {
      throw new NotFoundException(`user dengan id ${id} tidak dapat ditemukan`);
    }
    const banUser = await this.authRepository.save({
      ...payload,
      id,
      isBanned: true,
    });
    return this._success('OK', banUser);
  }
  async unBanUser(id: number, payload: BanUserDto): Promise<ResponseSuccess> {
    const post = await this.authRepository.find({
      where: {
        id: id,
      },
    });
    if (post == null) {
      throw new NotFoundException(`Post dengan id ${id} tidak dapat ditemukan`);
    }
    const banPost = await this.authRepository.save({
      ...payload,
      id,
      isBanned: false,
    });
    return this._success('OK', banPost);
  }
  async deleteUser(id: number): Promise<ResponseSuccess> {
    const user = await this.authRepository.findOne({
      where: {
        id,
      },
    });
    if (user === null) {
      throw new NotFoundException(`user dengan id ${id} tidak ditemukan`);
    }
    const deleteUser = await this.authRepository.delete(id);
    return this._success(`berhasil menghapus user dengan id ${id}`, user);
  }
}
