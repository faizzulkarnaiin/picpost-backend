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
import { NyobaService } from './nyoba2.service';
import { CreateNyobaDto } from './nyoba2.dto';

  
  @Controller('nyoba')
  export class Nyoba2Controller {
    constructor(private NyobaService: NyobaService) {}
  
     @Post('create')
     createBelajar(@Body() payload: CreateNyobaDto) {
      return this.NyobaService.createNyoba(payload);
     }
    
  }
  