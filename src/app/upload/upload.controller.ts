import { Controller, Post, UploadedFile, UseInterceptors, HttpException, HttpStatus, Param, Delete } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { CloudinaryStorage } from 'multer-storage-cloudinary';
import { v2 as cloudinary } from 'cloudinary';
import * as path from 'path';
import * as multer from 'multer';

const MAX_FILE_SIZE = 5 * 1024 * 1024; // Max 5MB

// Konfigurasi Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

function uploadMiddleware(folderName: string) {
  const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: (req, file) => {
      const folderPath = folderName.trim();
      const fileExtension = path.extname(file.originalname).substring(1);
      const publicId = `${file.fieldname}-${Date.now()}`;
      
      return {
        folder: folderPath, 
        public_id: publicId,
        format: fileExtension,
      };
    },
  });

  return multer({
    storage: storage,
    limits: {
      fileSize: MAX_FILE_SIZE, 
    },
  });
}

@Controller('upload')
export class UploadController {
  @UseInterceptors(
    FileInterceptor('file', {
      storage: uploadMiddleware('my_folder'),
    }),
  )
  @Post('file')
  async uploadFile(@UploadedFile() file: Express.Multer.File) {
    if (!file) {
      throw new HttpException('File not provided', HttpStatus.BAD_REQUEST);
    }

    return {
      message: 'File uploaded successfully',
      file_url: file.path, 
      file_name: file.filename,
    };
  }

  @Delete('file/delete/:filename')
  async deleteFile(@Param('filename') filename: string) {
    try {
      await cloudinary.uploader.destroy(filename);
      return { message: 'File deleted successfully' };
    } catch (error) {
      throw new HttpException('File deletion failed', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}
