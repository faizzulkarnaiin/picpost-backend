import {
    Controller,
    Get,
    Post,
    Body,
    Param,
    Put,
    Delete,
    Query
  } from '@nestjs/common';
import { MobilService } from './mobil.service';
import { FindMobilDto, createAndUpdateMobilDto, createMobilArrayDto, deleteMobilArrayDto } from './mobil.dto';
import { FindBookDto } from 'src/book/book.dto';

@Controller('mobil')
export class MobilController {
    constructor(private mobilService: MobilService) {}

    @Get('/list')
    findAllBook(@Query() findMobil: FindMobilDto) {
      return this.mobilService.getAllMobils(findMobil);
    } 

    @Post('create')
    createMobil(@Body() payload: createAndUpdateMobilDto) {
        return this.mobilService.createMobil(payload);
    }
    @Put('update/:id')
    updateBook(@Param('id') id: string, @Body() payload: createAndUpdateMobilDto) {
      return this.mobilService.updateMobil(Number(id), payload);
    }

    @Delete('delete/:id')
    deleteBook(@Param('id') id: string) {
      return this.mobilService.deleteMobil(+id);
    }

    @Get('detail/:id')
    findOneMobil(@Param('id') id: string) {
        return this.mobilService.getDetail(Number(id))
    }

    @Post('create/bulk')
    createBulk( @Body() payload: createMobilArrayDto) {
      return this.mobilService.bulkCreate(payload);
    }
  
    @Post('delete/bulk')
    deleteBulk( @Body() payload: deleteMobilArrayDto) {
      return this.mobilService.bulkDelete(payload);
    }

}
