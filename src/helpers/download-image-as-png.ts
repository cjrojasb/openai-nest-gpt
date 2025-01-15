import * as path from 'path';
import * as fs from 'fs';
import * as sharp from 'sharp';
import { v4 as uuidv4 } from 'uuid';
import { InternalServerErrorException } from '@nestjs/common';

export const downloadImageAsPng = async (
  url: string,
  isCompletedPath: boolean = false,
) => {
  const response = await fetch(url);

  if (!response.ok) {
    throw new InternalServerErrorException('Failed to download image');
  }

  const folderPath = path.resolve('./', './generated/images/');
  fs.mkdirSync(folderPath, { recursive: true });

  const imageNamePng = `${uuidv4()}.png`;
  const buffer = Buffer.from(await response.arrayBuffer());

  // fs.writeFileSync(`${folderPath}/${imageNamePng}`, buffer);

  const completePath = path.join(folderPath, imageNamePng);

  // Convert incoming image to PNG
  await sharp(buffer).png().ensureAlpha().toFile(completePath);

  return isCompletedPath ? completePath : imageNamePng;
};
