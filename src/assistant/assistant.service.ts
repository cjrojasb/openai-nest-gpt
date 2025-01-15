import OpenAI from 'openai';
import { checkRunCompleteStatusUseCase } from './use-cases/check-run-complete-status.use-case';
import { createMessageUseCase } from './use-cases/create-message.use-case';
import { createRunUseCase } from './use-cases/create-run.use-case';
import { createThreadUseCase } from './use-cases/create-thread.use-case';
import { getMessageListByThreadUseCase } from './use-cases/get-message-list-by-thread.use-case';
import { Injectable } from '@nestjs/common';
import { QuestionDto } from './dto/question.dto';

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

    await checkRunCompleteStatusUseCase(this.openai, {
      threadId: questionDto.threadId,
      runId: run.id,
    });

    const messages = await getMessageListByThreadUseCase(this.openai, {
      threadId: questionDto.threadId,
    });

    // Return messages in descending order
    return messages.reverse();
  }
}
