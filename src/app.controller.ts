import { Controller, Get, Post } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Get('list')
  belajarRouting(){
    console.log('Request received at '); 
    return "Belajar routing"
  }

  @Post('create')
  create(){
    return 'belajar routing dengan method post'
  }
    
}
