import { InjectRepository } from '@nestjs/typeorm';
import { Items } from './items.entity';
import { Between, Like, Repository } from 'typeorm';
import { CreateItemsDto, FindItemsDto } from './items.dto';
import { ResponsePagination, ResponseSuccess } from 'src/interface';
import BaseResponse from 'src/utils/response/base.response';
import {
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
@Injectable()
export class ItemsService extends BaseResponse {
    constructor(
        @InjectRepository(Items) private readonly itemsRepository : Repository<Items>
    ) {
        super();
    }

    async getAllUsers(findItemsDto : FindItemsDto): Promise<ResponsePagination> {
         const { page, pageSize, limit, nama, price, from_year, to_year,} = findItemsDto;
         const filter: {
            [key: string]: any;
          } = {};
          if (nama) {
            filter.nama = Like(`%${nama}%`);
          }
          if (price) {
            filter.price = Like(`%${price}%`);
          }
      
          if (from_year && to_year) {
            filter.year = Between(from_year, to_year);
          }
      
          if (from_year && !!to_year === false) {
            filter.year = Between(from_year, from_year);
          }
          const total = await this.itemsRepository.count({
            where: filter,
          });
          const items = await this.itemsRepository.find({
            where : filter,
            skip: limit,
            take: pageSize
          }) 
          return this._pagination("ok", items, total, page, pageSize)

    }


    async createItems(payload: CreateItemsDto): Promise<ResponseSuccess>{
      const {nama, price, imgUrl} = payload;
      try{
        const itemsSave = await this.itemsRepository.save({
          nama: nama,
          price: price,
          imgUrl:imgUrl
        })
        return this._success("berhasil menambahkan items", itemsSave)
      }catch(err){
        throw new HttpException('Ada Kesalahan', HttpStatus.BAD_REQUEST);
      }
    }
}
