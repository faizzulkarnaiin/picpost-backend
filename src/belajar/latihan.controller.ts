import {
  Controller,
  Body,
  Delete,
  Get,
  Patch,
  Post,
  Put,
  Param,
  Query,
} from '@nestjs/common';
import { LatihanService } from './latihan.service';
import { CreateBelajarDto } from './belajar.dto';

@Controller('latihan')
export class LatihanController {
  constructor(private latihanService: LatihanService) {}

   @Post('create')
   createBelajar(@Body() payload: CreateBelajarDto) {
    return this.latihanService.createBelajar(payload);
   }
  
}
