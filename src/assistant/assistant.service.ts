import { Injectable, Logger } from '@nestjs/common';
import OpenAI from 'openai';
import { createThreadUseCase } from './use-cases/create-thread.use-case';
import { createMessageUseCase } from './use-cases/create-message.use-case';
import { QuestionDto } from './dto/question.dto';
import { createRunUseCase } from './use-cases/create-run.use-case';

@Injectable()
export class AssistantService {
  private openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
  });

  async createThread() {
    return await createThreadUseCase(this.openai);
  }

  async userQuestion(questionDto: QuestionDto) {
    const message = await createMessageUseCase(this.openai, questionDto);
    const run = await createRunUseCase(this.openai, {
      threadId: questionDto.threadId,
    });
    Logger.log(run);
  }
}
