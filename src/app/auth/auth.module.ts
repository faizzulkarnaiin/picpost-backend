import { Module } from '@nestjs/common';
import { User } from './auth.entity';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtModule } from '@nestjs/jwt';
import { JwtAccessTokenStrategy } from './jwtAccessToken.strategy';
import { JwtRefreshTokenStrategy } from './jwtRefreshToken.strategy';
import { ResetPassword } from '../mail/reset_password.entity';
import { MailModule } from '../mail/mail.module';
import { PassportModule } from '@nestjs/passport';
import { jwt_config } from 'src/config/jwt.congif';
import { Following } from '../following/following.entity';
@Module({
  imports: [
    TypeOrmModule.forFeature([User, ResetPassword, Following]),
    JwtModule.register({
      
    }),
    PassportModule.register({
      defaultStrategy: 'jwt',
      property: 'user',
      session: false,
    }),
    MailModule,
  ],
  controllers: [AuthController],
  providers: [AuthService, JwtAccessTokenStrategy, JwtRefreshTokenStrategy],
})
export class AuthModule {}
