import OpenAI from 'openai';
import * as path from 'path';
import * as fs from 'fs';

interface Options {
  prompt: string;
  voice?: string;
}

export const textToAudioUseCase = async (
  openai: OpenAI,
  { prompt, voice }: Options,
) => {
  try {
    const voices = {
      alloy: 'alloy',
      echo: 'echo',
      fable: 'fable',
      onyx: 'onyx',
      nova: 'nova',
      shimmer: 'shimmer',
    };
    const selectedVoice = voices[voice] || 'nova';

    const folderPath = path.resolve(__dirname, '../../../generated/audios/');
    const speechFie = path.resolve(
      `${folderPath}/${new Date().getTime()}-${selectedVoice}.mp3`,
    );

    fs.mkdirSync(folderPath, { recursive: true });

    // * generated mp3
    const mp3 = await openai.audio.speech.create({
      model: 'tts-1',
      voice: selectedVoice,
      input: prompt,
      response_format: 'mp3',
    });

    const buffer = Buffer.from(await mp3.arrayBuffer());
    fs.writeFileSync(speechFie, buffer);

    return {
      file: speechFie,
    };
  } catch (error) {
    console.error('Error:', error);
    throw new Error('Connection error');
  }
};
