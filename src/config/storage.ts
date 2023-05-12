import { BadRequestException } from '@nestjs/common';
import * as fs from 'fs';
import { extname, basename, join } from 'path';
import * as multer from 'multer';

//this use when using multer package
export const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const directoryPath = 'uploads';

    if (!fs.existsSync(directoryPath)) {
      fs.mkdir(directoryPath, { recursive: true }, (err) => {
        if (err) {
          throw new BadRequestException(
            `Failed to create directory: ${err.message}`,
          );
        } else {
          cb(null, directoryPath);
        }
      });
    } else {
      cb(null, directoryPath);
    }
  },
  filename: (req, file, cb) => {
    const randomName = Array(32)
      .fill(null)
      .map(() => Math.round(Math.random() * 16).toString(16))
      .join('');
    const extension = extname(file.originalname);
    cb(null, `${randomName}${extension}`);
  },
});

//this is custom method for upload files
export const fileUpload = async (
  file: any,
  fpath: string = null,
  fname: string = null,
  validExtensions: string[] = ['.webp', '.jpg', '.png', '.gif'],
) => {
  const extension = extname(file.originalname);
  const nameWithoutExtension = basename(file.originalname, extension);
  const validExtensionsLower = validExtensions.map((ext) => ext.toLowerCase());
  const public_url = process.env.APP_URL || 'http://localhost:7777';

  if (!validExtensionsLower.includes(extension)) {
    throw new BadRequestException(`sorry you have provided an invalid file`);
  }

  const rootPath = join(__dirname, '../../..', 'public');

  let filePath = `${rootPath}/uploads`;

  if (fpath) {
    filePath += `/${fpath}`;
  }

  if (!fs.existsSync(filePath)) {
    fs.mkdir(filePath, { recursive: true }, (err) => {
      if (err) {
        throw new BadRequestException(
          `Failed to create directory: ${err.message}`,
        );
      }
    });
  }

  const randomName = Array(16)
    .fill(null)
    .map(() => Math.round(Math.random() * 16).toString(16))
    .join('');

  const fileName =
    fname && fname.length > 0 ? fname + extension : file.originalname;

  if (fs.existsSync(`${filePath}/${fileName}`)) {
    filePath = `${filePath}/${nameWithoutExtension}-${randomName}${extension}`;
  } else {
    filePath = `${filePath}/${fileName}`;
  }

  // Write the file to disk
  if (file.originalname && filePath) {
    const fileStream = fs.createWriteStream(filePath);
    fileStream.write(file.buffer);
    fileStream.end();

    return filePath.replace(rootPath, public_url);
  }

  throw new BadRequestException(`Requested file not found`);
};
