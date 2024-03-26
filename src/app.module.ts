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
import { ProdukModule } from './app/produk/produk.module';
import { KonsumenModule } from './app/konsumen/konsumen.module';
import { UniqueValidator } from './app/utils/validator/unique.validator';
import { OrderModule } from './app/order/order.module';
import { OrderDetailModule } from './app/order_detail/order_detail.module';
import { UploadController } from './app/upload/upload.controller';
import { join } from 'path';
import { ServeStaticModule } from '@nestjs/serve-static';
@Module({
  imports: [
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'public'),
    }),
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRoot(typeOrmConfig),
    BookModule,
    AuthModule,
    MailModule,
    KategoriModule,
    ProdukModule,
    KonsumenModule,
    OrderModule,
    OrderDetailModule,
  ],
  controllers: [AppController, UploadController],
  providers: [AppService, UniqueValidator],
})
export class AppModule {}
