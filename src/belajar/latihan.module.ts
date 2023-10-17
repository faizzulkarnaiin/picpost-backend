import { Module } from '@nestjs/common';
import { LatihanController } from './latihan.controller';
import { LatihanService } from './latihan.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Belajar } from './belajar.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Belajar])],
  controllers: [LatihanController],
  providers: [LatihanService]
})
export class BelajarModule {}
