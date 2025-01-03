import { Injectable } from '@nestjs/common';
import { orthographyCheckUseCase } from './use-cases/orthography.use-case';
import { OrthographyDto } from './dto/orthography.dto';

@Injectable()
export class GptService {
  // only for handle use cases
  async orthographyCheck(orthographyDto: OrthographyDto) {
    return await orthographyCheckUseCase({ prompt: orthographyDto.prompt });
  }
}
