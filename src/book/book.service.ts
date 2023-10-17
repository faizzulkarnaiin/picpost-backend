import {
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { NotFoundError, async } from 'rxjs';
import {
  ResponsePagination,
  ResponseSuccess,
} from 'src/interface/response.interface';
import {
  CreateBookDto,
  FindBookDto,
  UpdateBookDto,
  createBookArrayDto,
  deleteBookArrayDto,
} from './book.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Book } from './book.entity';
import { Any, Between, Like, Repository } from 'typeorm';
import { promises } from 'dns';
import BaseResponse from 'src/utils/response/base.response';
// import { FindBookDto } from 'src/utils/dto/page.dto';

@Injectable()
export class BookService extends BaseResponse {
  constructor(
    @InjectRepository(Book) private readonly bookRepository: Repository<Book>,
  ) {
    super();
  }
 
  private books: {
    id: number;
    title: string;
    author: string;
    year: number;
  }[] = [
    {
      id: 1,
      title: 'HTML CSS',
      author: 'ihsanabuhanifah',
      year: 2023,
    },
    {
      id: 2,
      title: 'mtk',
      author: 'ihsanabuhanifah',
      year: 2023,
    },
  ];

  async getAllBooks(findBookDto: FindBookDto): Promise<ResponsePagination> {
    const { page, pageSize, title, author, from_year, to_year, limit } =
      findBookDto;

    const filter: {
      [key: string]: any;
    } = {};

    if (title) {
      filter.title = Like(`%${title}%`);
    }
    if (author) {
      filter.author = Like(`%${author}%`);
    }

    if (from_year && to_year) {
      filter.year = Between(from_year, to_year);
    }

    if (from_year && !!to_year === false) {
      filter.year = Between(from_year, from_year);
    }

    const total = await this.bookRepository.count({
      where: filter,
    });

    const book = await this.bookRepository.find({
      where: filter,
      skip: limit,
      take: pageSize,
    });
    return this._pagination('ok', book, total, page, pageSize, )
  }
  async createBook(payload: CreateBookDto): Promise<ResponseSuccess> {
    const { title, author, year } = payload;
    try {
      const bookSave = await this.bookRepository.save({
        title: title,
        author: author,
        year: year,
      });

      return this._success("berhasil menambahkan buku", bookSave)
    } catch (err) {
      throw new HttpException('Ada Kesalahan', HttpStatus.BAD_REQUEST);
    }
  }
  async updateBook(
    id: number,
    payload: UpdateBookDto,
  ): Promise<ResponseSuccess> {
    const { title, author, year } = payload;
    const book = await this.bookRepository.findOne({
      where: {
        id,
      },
    });

    if (book === null) {
      throw new NotFoundException(`Buku dengan id ${id} Tidak Ditemukan`);
    }

    const update = await this.bookRepository.save({ ...payload, id });

    return {
      status: 'ok',
      message: 'berhasil mengupdate buku',
      data: update,
    };
  }

  async deleteBook(id: number): Promise<ResponseSuccess> {
    const book = await this.bookRepository.findOne({ where: { id } });

    if (book == null)
      throw new NotFoundException(
        `Buku dengan id ${id} Tidak dapat ditemukan `,
      );

    const deleteBook = await this.bookRepository.delete(id);

    return this._success(`berhasil menghapus buku dengan id ${id}`, book)
  }

  private findBookById(id: number) {
    // mencari index dari buku berdasarkan id
    const bookIndex = this.books.findIndex((book) => book.id === id);

    if (bookIndex === -1) {
      throw new NotFoundException(`Buku dengan ${id} tidak ditemukan`);
    }
    return bookIndex;
  }

  async getDetail(id: number): Promise<ResponseSuccess> {
    const book = await this.bookRepository.findOne({
      where: {
        id,
      },
    });

    if (book === null) {
      throw new NotFoundException(`Buku dengan id ${id} Tidak Ditemukan`);
    }

    return this._success(`berhasil menemukan buku dengan id ${id}`, book)
  }
  async bulkCreate(payload: createBookArrayDto): Promise<ResponseSuccess> {
    try {
      let berhasil = 0;
      let gagal = 0;
      await Promise.all(
        payload.data.map(async (item) => {
          try {
            await this.bookRepository.save(item);

            berhasil += 1;
          } catch {
            gagal += 1;
          }
        }),
      );
      return this._success(`Berhasil menambahkan buku sebanyak ${berhasil} dan gagal sebanyak ${gagal}`, payload);
    } catch {
      throw new HttpException('Ada Kesalahan', HttpStatus.BAD_REQUEST);
    }
  }

  async bulkDelete(payload: deleteBookArrayDto): Promise<ResponseSuccess> {
    try {
      let berhasil = 0;
      let gagal = 0;
      await Promise.all(
        payload.delete.map(async (item) => {
          try {
            await this.bookRepository.delete(item);
            berhasil += 1;
          } catch {
            gagal += 1;
          }
        }),
      );
      return this._success(`Berhasil menghapus buku sebanyak ${berhasil} dan gagal sebanyak ${gagal}`, payload)
    } catch {
      throw new HttpException('Ada Kesalahan', HttpStatus.BAD_REQUEST);
    }
  }
}
