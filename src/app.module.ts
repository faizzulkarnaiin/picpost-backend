import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { BookModule } from './book/book.module';
import { typeOrmConfig } from './config/typeorm.config';
import { TypeOrmModule } from '@nestjs/typeorm';

import { AuthModule } from './app/auth/auth.module';
import { MailModule } from './app/mail/mail.module';
import { ConfigModule } from '@nestjs/config';
import { KategoriModule } from './app/kategori/kategori.module';
@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRoot(typeOrmConfig),
    BookModule,
    AuthModule,
    MailModule,
    KategoriModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
