import {
  HttpException,
  HttpStatus,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import BaseResponse from 'src/utils/response/base.response';
import { Post } from './post.entity';
import { Like, Repository, UpdateDescription } from 'typeorm';
import { REQUEST } from '@nestjs/core';
import {
  BanPostDto,
  CreatePostDto,
  FindAllPost,
  UpdatePostDto,
} from './post.dto';
import { ResponsePagination, ResponseSuccess } from 'src/interface';
import { Tag } from '../tag/tag.entity';
import { stringify } from 'querystring';
import { Following } from '../following/following.entity';

@Injectable()
export class PostService extends BaseResponse {
  constructor(
    @InjectRepository(Post)
    private readonly postRepository: Repository<Post>,
    @InjectRepository(Following)
    private readonly followRepository: Repository<Following>,
    @Inject(REQUEST) private req: any,
    @InjectRepository(Tag)
    private readonly tagRepository: Repository<Tag>,
  ) {
    super();
  }
  private shuffle(array: any[]): any[] {
    let currentIndex = array.length,
      randomIndex;

    // Selama masih ada elemen yang belum diacak
    while (currentIndex !== 0) {
      // Ambil elemen tersisa
      randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex--;

      // Tukar elemen dengan elemen saat ini
      [array[currentIndex], array[randomIndex]] = [
        array[randomIndex],
        array[currentIndex],
      ];
    }

    return array;
  }

  async createPost(payload: CreatePostDto): Promise<ResponseSuccess> {
    try {
      const tags = await Promise.all(
        payload.tags.map(async (tagDto) => {
          let tag = await this.tagRepository.findOne({
            where: { name: tagDto.name },
          });
          if (!tag) {
            // tag = this.tagRepository.create({});
            await this.tagRepository.save({
              ...tagDto,
              created_by: {
                id: this.req.user.id,
              },
            });
          }
          return tag;
        }),
      );
      const pay = await this.postRepository.save({
        ...payload,
        created_by: {
          id: this.req.user.id,
          nama: this.req.user.nama,
        },
        user: {
          id: this.req.user.id,
          nama: this.req.user.nama,
        },
        tags: tags,
      });

      return this._success('Ok', pay);
    } catch (error) {
      console.log(error);
      throw new HttpException('Ada Kesalahan', HttpStatus.UNPROCESSABLE_ENTITY);
    }
  }
  async findAll(query: FindAllPost): Promise<ResponsePagination> {
    const { keyword, page, pageSize, limit, tagId } = query;
    const filterKeyword: any = {
      isBanned: false,
    };

    if (keyword) {
      filterKeyword.tags = {
        ...filterKeyword.tags,
        name: Like(`%${keyword}%`),
      };
    }

    if (tagId) {
      filterKeyword.tags = {
        ...filterKeyword.tags,
        id: tagId,
      };
    }

    // if (tagId) {
    //   filterKeyword['tags.id'] = tagId;
    // }
    const total = await this.postRepository.count({
      where: filterKeyword,
    });
    const result = await this.postRepository.find({
      where: filterKeyword,
      relations: [
        'created_by',
        'updated_by',
        'likes.user_id',
        'images',
        'comments',
        'comments.created_by',
        'tags',
        // 'tag'
      ],
      select: {
        id: true,
        judul: true,
        images: true,
        // image: true,
        isBanned: true,
        konten: true,
        created_at: true,
        likes: {
          id: true,
          created_by: {
            id: true,
            nama: true,
            avatar: true,
          },
          user_id: {
            id: true,
            avatar: true,
            nama: true,
          },
        },
        created_by: {
          id: true,
          nama: true,
          avatar: true,
        },
        updated_by: {
          id: true,
          nama: true,
        },
        comments: {
          id: true,
          isi_komentar: true,
          created_by: {
            id: true,
            nama: true,
          },
        },
        tags: {
          id: true,
          name: true,
        },
      },
      skip: limit,
      take: pageSize,
    });
    let newResult = result.map((post) => ({
      ...post,
      likeCount: post.likes.length,
      likedBy: post.likes.map((like) => like.user_id),
    }));
    // Acak urutan postingan
    newResult = this.shuffle(newResult);

    // Hitung jumlah total halaman
    const totalPage = Math.ceil(total / pageSize);
    return this._pagination('OK', newResult, total, page, pageSize);
  }
  async findAllWithBan(query: FindAllPost): Promise<ResponsePagination> {
    const { keyword, page, pageSize, limit, tagId } = query;
    const filterKeyword = [];

    if (keyword) {
      filterKeyword.push({
        tags: {
          name: Like(`%${keyword}%`),
        },
      }),
        filterKeyword.push({
          judul: Like(`%${keyword}%`),
        });
    }
    if (tagId) {
      filterKeyword.push({
        tags: {
          id: tagId,
        },
      });
    }
    const total = await this.postRepository.count({
      where: filterKeyword,
    });
    const result = await this.postRepository.find({
      where: filterKeyword,
      relations: [
        'created_by',
        'updated_by',
        'likes.user_id',
        'images',
        'comments',
        'comments.created_by',
        'tags',
        // 'tag'
      ],
      select: {
        id: true,
        judul: true,
        images: true,
        // image: true,
        isBanned: true,
        konten: true,
        created_at: true,
        likes: {
          id: true,
          created_by: {
            id: true,
            nama: true,
            avatar: true,
          },
          user_id: {
            id: true,
            avatar: true,
            nama: true,
          },
        },
        created_by: {
          id: true,
          nama: true,
          avatar: true,
        },
        updated_by: {
          id: true,
          nama: true,
        },
        comments: {
          id: true,
          isi_komentar: true,
          created_by: {
            id: true,
            nama: true,
          },
        },
        tags: {
          id: true,
          name: true,
        },
      },
      skip: limit,
      take: pageSize,
    });
    let newResult = result.map((post) => ({
      ...post,
      likeCount: post.likes.length,
      likedBy: post.likes.map((like) => like.user_id),
    }));
    // Acak urutan postingan
    newResult = this.shuffle(newResult);

    // Hitung jumlah total halaman
    const totalPage = Math.ceil(total / pageSize);
    return this._pagination('OK', newResult, total, page, pageSize);
  }

  async getPostByuser(): Promise<ResponseSuccess> {
    const getPost = await this.postRepository.find({
      where: { user: { id: this.req.user.id } },
      relations: ['created_by', 'images'],
      select: {
        created_at: true,

        id: true,
        // image: true,
        judul: true,
        konten: true,
        images: true,
        isBanned: true,
        created_by: {
          id: true,
          nama: true,
          avatar: true,
        },
      },
    });
    return this._success('OK', getPost);
  }
  async getPostByuserId(id: number): Promise<ResponseSuccess> {
    const getPost = await this.postRepository.find({
      where: { user: { id: id } },
      relations: ['created_by', 'images'],
      select: {
        created_at: true,

        id: true,
        // image: true,
        judul: true,
        konten: true,
        images: true,
        created_by: {
          id: true,
          nama: true,
          avatar: true,
        },
      },
    });
    return this._success('OK', getPost);
  }
  async deletePost(id: number): Promise<ResponseSuccess> {
    const post = await this.postRepository.findOne({
      where: {
        id,
      },
    });
    if (post === null) {
      throw new NotFoundException(`Post dengan id ${id} tidak ditemukan`);
    }
    const deleteKategori = await this.postRepository.delete(id);
    return this._success(`berhasil menghapus Post dengan id ${id}`, post);
  }

  async updatePost(
    id: number,
    payload: UpdatePostDto,
  ): Promise<ResponseSuccess> {
    const post = await this.postRepository.find({
      where: {
        id: id,
      },
    });
    if (post == null) {
      throw new NotFoundException(`Post dengan id ${id} tidak dapat ditemukan`);
    }
    const updatePost = await this.postRepository.save({
      ...payload,
      id,
      updated_by: {
        id: this.req.user.id,
        nama: this.req.user.nama,
      },
    });
    return this._success('OK', updatePost);
  }
  async banPost(id: number, payload: BanPostDto): Promise<ResponseSuccess> {
    const post = await this.postRepository.find({
      where: {
        id: id,
      },
    });
    if (post == null) {
      throw new NotFoundException(`Post dengan id ${id} tidak dapat ditemukan`);
    }
    const banPost = await this.postRepository.save({
      ...payload,
      id,
      isBanned: true,
    });
    return this._success('OK', banPost);
  }
  async unBanPost(id: number, payload: BanPostDto): Promise<ResponseSuccess> {
    const post = await this.postRepository.find({
      where: {
        id: id,
      },
    });
    if (post == null) {
      throw new NotFoundException(`Post dengan id ${id} tidak dapat ditemukan`);
    }
    const banPost = await this.postRepository.save({
      ...payload,
      id,
      isBanned: false,
    });
    return this._success('OK', banPost);
  }

  async getDetailById(id: number): Promise<ResponseSuccess> {
    try {
      const data: any = await this.postRepository.findOne({
        where: {
          id: id,
        },
        relations: [
          'created_by',
          'created_by.following',
          'tags',
          'likes',
          'comments',
          'images',
          'likes.created_by',
          'savePosts',
          'savePosts.created_by',
        ],
      });
      if (data === null) {
        throw new NotFoundException(`Post dengan id ${id} tidak ditemukan`);
      }
      data.isLikedByUser = data.likes.some(
        (like) => like.created_by && like.created_by.id === this.req.user.id,
      );
      data.isSavedByUser = data.savePosts.some(
        (save) => save.created_by && save.created_by.id === this.req.user.id,
      );
      const userLike = data.likes.find(
        (like) => like.created_by && like.created_by.id === this.req.user.id,
      );
      data.isLikedByUser = !!userLike;
      data.userLikeId = userLike ? userLike.id : null;

      // Cek apakah user sudah save post
      const userSave = data.savePosts.find(
        (save) => save.created_by && save.created_by.id === this.req.user.id,
      );
      data.isSavedByUser = !!userSave;
      data.userSaveId = userSave ? userSave.id : null;

      const isFollowed = await this.followRepository.findOne({
        where: {
          follower: {
            id: this.req.user.id,
          },
          followed: {
            id: data?.created_by.id,
          },
        },
      });
      data.isFollowed = !!isFollowed;
      data.followingId = isFollowed ? isFollowed.id : null; // const isFollowed = data.created_by.following.find(
      //   (f) => f.followed && f.followed.id === f.follower === this.req.user.id,
      // );
      // data.isFollowed = !!isFollowed;
      return this._success('OK', data);
    } catch (error) {
      console.log(error);
      return error;
    }
  }
}
