import { Module } from '@nestjs/common';
import { Nyoba2Controller } from './nyoba2.controller';
import { NyobaService } from './nyoba2.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Nyoba } from './nyoba.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Nyoba])],
  controllers: [Nyoba2Controller],
  providers: [NyobaService]
})
export class Nyoba2Module {}
