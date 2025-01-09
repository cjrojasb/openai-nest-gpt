import * as fs from 'fs';
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
  const pngImagePath = await downloadImageAsPng(originalImage, true);
  const maskPath = await downloadBase64ImageAsPng(maskImage, true);

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
