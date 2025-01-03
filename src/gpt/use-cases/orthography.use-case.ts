interface Options {
  prompt: string;
}

export const orthographyCheckUseCase = async ({ prompt }: Options) => {
  return {
    message: prompt,
    apiKey: process.env.OPENAI_API_KEY,
  };
};
