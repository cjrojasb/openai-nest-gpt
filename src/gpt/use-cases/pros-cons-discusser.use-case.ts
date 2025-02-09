import OpenAI from 'openai';

interface Options {
  prompt: string;
}

export const prosConsDiscusserUseCase = async (
  openai: OpenAI,
  { prompt }: Options,
) => {
  try {
    const completion = await openai.chat.completions.create({
      model: 'gpt-4o',
      messages: [
        {
          role: 'system',
          content: `Se te dará una pregunta y tu tarea es dar una respuesta con pros y contras, los pros y contras deben de estar en una lista y la respuesta debe de ser en formato markdown.`,
        },
        {
          role: 'user',
          content: prompt,
        },
      ],
      temperature: 0.8,
      max_tokens: 500,
    });

    return completion.choices[0].message;
  } catch (error) {
    console.error('Error:', error);
    throw new Error('Connection error');
  }
};
