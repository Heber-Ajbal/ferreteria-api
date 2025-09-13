// src/files/product-image.storage.ts
import { diskStorage } from 'multer';
import { extname } from 'path';
import { existsSync, mkdirSync } from 'fs';

export const productImageStorage = diskStorage({
  destination: (_, __, cb) => {
    const dir = 'uploads/products';
    if (!existsSync(dir)) mkdirSync(dir, { recursive: true });
    cb(null, dir);
  },
  filename: (_, file, cb) => {
    const id = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, id + extname(file.originalname).toLowerCase());
  },
});

export function imageFileFilter(
  _: any,
  file: Express.Multer.File,
  cb: (error: Error | null, acceptFile: boolean) => void,
) {
  if (!file.mimetype.startsWith('image/')) {
    return cb(new Error('Solo se permiten imágenes'), false);
  }
  cb(null, true);
}
