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
import { query } from 'express';

@Controller('latihan')
export class LatihanController {
  @Get()
  findAll(@Query() query:any) {
    return {
        query,
    }
  }

  @Post()
  create(@Body() payload: any) {
    console.log(payload);
    // return 'latihan menggunakan method POST';
    return {
      payload: payload,
    };
  }
  @Post('create')
  create2(@Body('name') name: string, @Body('sekolah') sekolah: string) {
    console.log(name);
    console.log(sekolah);

    return {
      name: name,
      sekolah: sekolah,
    };
  }

  @Put('update/:id/:nama')
  update(
    @Body() payload: any,
    @Param('id') id: string,
    @Param('nama') nama: string,
  ) {
    return {
      id: id,
      nama: nama,
      payload: payload,
    };
  }

  @Patch()
  patch() {
    return 'latihan menggunakan method PATCH';
  }

  @Delete('delete/:id')
  delete(@Param('id') id:string) {
    return {
        id,
    }
  }
}
