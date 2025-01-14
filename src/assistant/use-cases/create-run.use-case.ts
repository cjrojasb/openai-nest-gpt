import OpenAI from 'openai';

interface Options {
  threadId: string;
  assistantId?: string;
}

export const createRunUseCase = async (
  openai: OpenAI,
  { threadId, assistantId = `${process.env.ASSISTANT_ID}` }: Options,
) => {
  const run = await openai.beta.threads.runs.create(threadId, {
    assistant_id: assistantId,
    // instructions: 'new rules for assistant', (overwrites the assistant coming from the assistant)
  });

  return run;
};
