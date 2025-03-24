import { Injectable } from '@nestjs/common'
import {v2 as cloudinary, UploadApiResponse} from 'cloudinary'

@Injectable()
export class UploadService {
  constructor() {
    cloudinary.config({ 
      cloud_name: 'drwi32qkb', 
      api_key: '685351825318234', 
      api_secret: 'B34F6ZA_5QKaqFx1L-mqR-8N6fQ'
    });
  }

  public async removeFile(publicId: string): Promise<string> {
    return await cloudinary.uploader.destroy(publicId);
  }

  public async uploadFile(
    file: Express.Multer.File,
    publicId: string,
    folder: string
  ): Promise<any> {
    const mimeType = file.mimetype;
    const base64Data = file.buffer.toString('base64');
    const uploadResult = await cloudinary.uploader
      .upload(`data:${mimeType};base64,${base64Data}`, {
        public_id: publicId,
        folder: folder
      })
      .catch((error) => {
        console.log(error);
      });
    return uploadResult;
  }

  public getPublicId(url: string): string {
    const uri = new URL(url);
    return uri.pathname.split('/').slice(5).join('/').split('.')[0];
  }
}

