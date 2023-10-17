import { Module } from '@nestjs/common';
import { MobilController } from './mobil.controller';
import { MobilService } from './mobil.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Mobil } from './mobil.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Mobil])],
  controllers: [MobilController],
  providers: [MobilService]
})
export class MobilModule {}
