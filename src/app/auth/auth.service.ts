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
import { MongoNetworkTimeoutError, Repository } from 'typeorm';
import BaseResponse from 'src/utils/response/base.response';
import {
  GithubDto,
  GoogleDto,
  LoginDto,
  RegisterDto,
  ResetPasswordDto,
  UpdateUserDto,
  UserDto,
} from './auth.dto';
import { ResponseSuccess } from 'src/interface';
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
@Injectable()
export class AuthService extends BaseResponse {
  constructor(
    @InjectRepository(User) private readonly authRepository: Repository<User>,
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
    await this.authRepository.save(payload);

    return this._success('Register Berhasil', checkUserExists);
  }

  async login(payload: LoginDto): Promise<ResponseSuccess> {
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
      },
    });

    if (!checkUserExists) {
      throw new HttpException(
        'User tidak ditemukan',
        HttpStatus.UNPROCESSABLE_ENTITY,
      );
    }

    const checkPassword = await compare(
      payload.password,
      checkUserExists.password,
    );

    if (checkPassword) {
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
      return this._success('Login Success', {
        ...checkUserExists,
        access_token: access_token,
        refresh_token: refresh_token,
        role: 'admin',
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

      // Buat token akses
      const access_token = await this.generateGithubJWT(
        githubJwtPayload,
        '1d',
        jwt_config.access_token_secret,
      );

      let refresh_token;
      if (user) {
        // Jika pengguna sudah ada, buat refresh token baru
        refresh_token = await this.generateGithubJWT(
          githubJwtPayload,
          '7d',
          jwt_config.refresh_token_secret,
        );
        // Simpan refresh token ke dalam basis data
        user.refresh_token = refresh_token;
        await this.authRepository.save(user);
      } else {
        // Jika pengguna belum ada, simpan pengguna baru dan buat refresh token baru
        user = await this.authRepository.save(payload);
        refresh_token = await this.generateGithubJWT(
          githubJwtPayload,
          '7d',
          jwt_config.refresh_token_secret,
        );
        // Simpan refresh token ke dalam basis data
        user.refresh_token = refresh_token;
        await this.authRepository.save(user);
      }

      // Kembalikan respons sukses dengan token
      return this._success('Login Success', {
        ...payload,
        access_token: access_token,
        refresh_token: refresh_token,
        role: 'siswa',
      });
    } catch (error) {
      // Tangani kesalahan
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

      // Buat token akses
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
      // Tangani kesalahan
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
  async updateProfile(id: number, payload: UpdateUserDto): Promise<ResponseSuccess> {
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
    const link = `http://localhost:3310/auth/reset-password/${user.id}/${token}`; //membuat link untuk reset password
    const feLink = `http://localhost:3010/auth/${user.id}/${token}/reset-password`;
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
}
