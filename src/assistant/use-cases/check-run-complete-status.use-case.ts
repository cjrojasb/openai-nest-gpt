import OpenAI from 'openai';

interface Options {
  threadId: string;
  runId: string;
}

export const checkRunCompleteStatusUseCase = async (
  openai: OpenAI,
  { threadId, runId }: Options,
) => {
  const runStatus = await openai.beta.threads.runs.retrieve(threadId, runId);

  if (runStatus.status === 'completed') {
    return runStatus;
  }

  // Wait for 1 second before checking again
  await new Promise((resolve) => setTimeout(resolve, 1000));

  return await checkRunCompleteStatusUseCase(openai, { threadId, runId });
};
