import * as fs from 'fs';
import * as path from 'path';
import OpenAI from 'openai';
import {
  downloadBase64ImageAsPng,
  downloadImageAsPng,
} from 'src/helpers/download-image-as-png';

interface Options {
  prompt: string;
  originalImage?: string;
  maskImage?: string;
}

export const imageGenerationUseCase = async (
  openai: OpenAI,
  { prompt, originalImage, maskImage }: Options,
) => {
  try {
    if (!originalImage || !maskImage) {
      return generateImage(openai, prompt);
    }
    return editImage(openai, { prompt, originalImage, maskImage });
  } catch (error) {
    console.error('Error:', error);
    throw new Error('Connection error in image generation');
  }
};

const generateImage = async (openai: OpenAI, prompt: string) => {
  const response = await openai.images.generate({
    model: 'dall-e-3',
    prompt: prompt,
    n: 1,
    size: '1024x1024',
    quality: 'standard',
    response_format: 'url',
  });

  const fileName = await downloadImageAsPng(response.data[0].url);
  const url = `${process.env.SERVER_URL}/gpt/image-generation/${fileName}`;

  return {
    url: url,
    openAIUrl: response.data[0].url,
    revised_prompt: response.data[0].revised_prompt,
  };
};

const editImage = async (
  openai: OpenAI,
  { prompt, originalImage, maskImage }: Options,
) => {
  // originalImage={{API_URL}}/image-generation/7974eda1-1b71-494c-a388-28ead64ebb89.png
  // maskImage=Base64;AASDADASDASDASDASDASDASDASD
  const pngImagePath = await downloadImageAsPng(originalImage);
  const maskPath = await downloadBase64ImageAsPng(maskImage);

  const response = await openai.images.edit({
    model: 'dall-e-3',
    prompt: prompt,
    image: fs.createReadStream(pngImagePath),
    mask: fs.createReadStream(maskPath),
    n: 1,
    size: '1024x1024',
    response_format: 'url',
  });

  const fileName = await downloadImageAsPng(response.data[0].url);
  const url = `${process.env.SERVER_URL}/gpt/image-generation/${fileName}`;

  return {
    url: url,
    openAIUrl: response.data[0].url,
    revised_prompt: response.data[0].revised_prompt,
  };
};
