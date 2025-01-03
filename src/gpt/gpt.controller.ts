import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
} from '@nestjs/common';
import { GptService } from './gpt.service';
import { OrthographyDto } from './dto/orthography.dto';

@Controller('gpt')
export class GptController {
  constructor(private readonly gptService: GptService) {}

  @Get('health')
  @HttpCode(HttpStatus.OK)
  health() {
    return this.gptService.health();
  }

  @Post('orthography-check')
  orthographyCheck(@Body() orthographyDto: OrthographyDto) {
    return this.gptService.orthographyCheck(orthographyDto);
  }
}
