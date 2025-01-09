import OpenAI from 'openai';
import * as fs from 'fs';
import * as path from 'path';
import { AudioToTextDto } from './dto/audio-to-text.dto';
import { audioToTextUseCase } from './use-cases/audio-to-text.use-case';
import { Injectable, NotFoundException } from '@nestjs/common';
import { orthographyCheckUseCase } from './use-cases/orthography.use-case';
import { OrthographyDto } from './dto/orthography.dto';
import { ProsConsDiscusserDto } from './dto/pro-cons-discusser.dto';
import { prosConsDiscusserStreamUseCase } from './use-cases/pros-cons-discusser-stream.use-case';
import { prosConsDiscusserUseCase } from './use-cases/pros-cons-discusser.use-case';
import { TextToAudioDto } from './dto/text-to-audio.dto';
import { textToAudioUseCase } from './use-cases/text-to-audio.use-case';
import { TranslateDto } from './dto/translate.dto';
import { translateUseCase } from './use-cases/translate.use-case';
import { ImageGenerationDto } from './dto/image-generation.dto';
import { imageGenerationUseCase } from './use-cases/image-generation.use-case';
import { ImageVariationDto } from './dto/image-variation.dto';
import { imageVariationUseCase } from './use-cases/image-variation.use-case';

@Injectable()
export class GptService {
  private openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
  });

  async health() {
    return 'OK';
  }

  async orthographyCheck(orthographyDto: OrthographyDto) {
    return await orthographyCheckUseCase(this.openai, {
      prompt: orthographyDto.prompt,
    });
  }

  async prosConsDiscusser(prosConsDiscusserDto: ProsConsDiscusserDto) {
    return await prosConsDiscusserUseCase(this.openai, {
      prompt: prosConsDiscusserDto.prompt,
    });
  }

  async prosConsDiscusserStream(prosConsDiscusserDto: ProsConsDiscusserDto) {
    return await prosConsDiscusserStreamUseCase(this.openai, {
      prompt: prosConsDiscusserDto.prompt,
    });
  }

  async translate(translateDto: TranslateDto) {
    return await translateUseCase(this.openai, {
      prompt: translateDto.prompt,
      lang: translateDto.lang,
    });
  }

  async getTextToAudio(fileId: string) {
    const filePath = path.resolve(
      __dirname,
      `../../generated/audios/${fileId}.mp3`,
    );
    const wasFound = fs.existsSync(filePath);

    if (!wasFound) throw new NotFoundException(`File ${fileId} not found`);

    return filePath;
  }

  async textToAudio(textToAudioDto: TextToAudioDto) {
    return await textToAudioUseCase(this.openai, {
      prompt: textToAudioDto.prompt,
      voice: textToAudioDto.voice,
    });
  }

  async audioToText(
    audioFile: Express.Multer.File,
    audioToTextDto: AudioToTextDto,
  ) {
    const { prompt } = audioToTextDto;
    return await audioToTextUseCase(this.openai, {
      audioFile,
      prompt,
    });
  }

  async imageGeneration(imageGenerationDto: ImageGenerationDto) {
    return await imageGenerationUseCase(this.openai, { ...imageGenerationDto });
  }

  getGeneratedImage(filename: string) {
    const filePath = path.resolve('./', './generated/images/', filename);
    const exists = fs.existsSync(filePath);

    if (!exists) {
      throw new NotFoundException('File not found');
    }

    return filePath;
  }

  async imageVariation(imageVariationDto: ImageVariationDto) {
    return await imageVariationUseCase(this.openai, imageVariationDto);
  }
}
