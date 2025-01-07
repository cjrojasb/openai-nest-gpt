import { Injectable } from '@nestjs/common';
import { orthographyCheckUseCase } from './use-cases/orthography.use-case';
import { OrthographyDto } from './dto/orthography.dto';
import { ProsConsDiscusserDto } from './dto/pro-cons-discusser.dto';
import { prosConsDiscusserStreamUseCase } from './use-cases/pros-cons-discusser-stream.use-case';
import { prosConsDiscusserUseCase } from './use-cases/pros-cons-discusser.use-case';
import OpenAI from 'openai';
import { TranslateDto } from './dto/translate.dto';
import { translateUseCase } from './use-cases/translate.use-case';

@Injectable()
export class GptService {
  private openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
  });

  async health() {
    return 'OK';
  }

  // only for handle use cases
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
}
