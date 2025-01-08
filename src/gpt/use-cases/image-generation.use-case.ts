import OpenAI from 'openai';
import { downloadImageAsPng } from 'src/helpers/download-image-as-png';

interface Options {
  prompt: string;
  originalImage?: string;
  maskImage?: string;
}

export const imageGenerationUseCase = async (
  openai: OpenAI,
  { prompt, originalImage, maskImage }: Options,
) => {
  const response = await openai.images.generate({
    model: 'dall-e-3',
    prompt: prompt,
    n: 1,
    size: '1024x1024',
    quality: 'standard',
    response_format: 'url',
  });

  const url = response.data[0].url;
  await downloadImageAsPng(url);
  return {
    url,
    localPath: '',
    revised_prompt: response.data[0].revised_prompt,
  };
};
