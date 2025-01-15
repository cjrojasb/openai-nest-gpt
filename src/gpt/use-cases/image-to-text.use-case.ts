import OpenAI from 'openai';
import { convertToBase64 } from 'src/helpers/convert-to-base-64';

interface Options {
  imageFile: Express.Multer.File;
  prompt: string;
}

export const imageToTextUseCase = async (
  openai: OpenAI,
  { imageFile, prompt }: Options,
) => {
  const response = await openai.chat.completions.create({
    model: 'gpt-4o',
    messages: [
      {
        role: 'user',
        content: [
          {
            type: 'text',
            text: prompt ?? '¿Qué logras ver en la imagen?',
          },
          {
            type: 'image_url',
            image_url: {
              url: convertToBase64(imageFile),
            },
          },
        ],
      },
    ],
  });

  return {
    message: response.choices[0].message.content,
  };
};
