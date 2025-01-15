import * as path from 'path';
import * as fs from 'fs';
import * as sharp from 'sharp';
import { v4 as uuidv4 } from 'uuid';

export const downloadBase64ImageAsPng = async (
  base64Image: string,
  isCompletedPath: boolean = false,
) => {
  // Remover encabezado
  base64Image = base64Image.split(';base64,').pop();
  const imageBuffer = Buffer.from(base64Image, 'base64');

  const folderPath = path.resolve('./', './generated/images/');
  fs.mkdirSync(folderPath, { recursive: true });

  const imageNamePng = `${uuidv4()}-64.png`;
  const completePath = path.join(folderPath, imageNamePng);

  // Transformar a RGBA, png // Así lo espera OpenAI
  await sharp(imageBuffer).png().ensureAlpha().toFile(completePath);

  return isCompletedPath ? completePath : imageNamePng;
};
