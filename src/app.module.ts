import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { LatihanModule } from './latihan/latihan.module';
import { BookModule } from './book/book.module';
import { UsersModule } from './users/users.module';
import { typeOrmConfig } from './config/typeorm.config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BelajarModule } from './belajar/latihan.module';
import { Nyoba2Module } from './nyoba2/nyoba2.module';
import { MobilModule } from './mobil/mobil.module';
import { ItemsModule } from './items/items.module';
@Module({
  imports: [
    TypeOrmModule.forRoot(typeOrmConfig),
    LatihanModule,
    BookModule,
    UsersModule,
    BelajarModule,
    Nyoba2Module,
    MobilModule,
    ItemsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
