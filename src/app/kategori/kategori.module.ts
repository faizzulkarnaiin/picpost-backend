import { Module } from '@nestjs/common';
import { KategoriController } from './kategori.controller';
import { KategoriService } from './kategori.service';
import { typeOrmConfig } from 'src/config/typeorm.config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Kategori } from './kategori.entity';

@Module({
  imports : [TypeOrmModule.forFeature([Kategori])],
  controllers: [KategoriController],
  providers: [KategoriService]
})
export class KategoriModule {}
