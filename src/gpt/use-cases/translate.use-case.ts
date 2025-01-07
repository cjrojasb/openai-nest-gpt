import OpenAI from 'openai';

interface Options {
  prompt: string;
  lang: string;
}

export const translateUseCase = async (
  openai: OpenAI,
  { prompt, lang }: Options,
) => {
  try {
    const completion = await openai.chat.completions.create({
      model: 'gpt-4o',
      messages: [
        {
          role: 'system',
          content: `Traduce el siguiente texto al idioma ${lang}: ${prompt}`,
        },
      ],
      temperature: 0.5,
      max_tokens: 150,
    });

    return {
      message: completion.choices[0].message.content,
    };
  } catch (error) {
    console.error('Error:', error);
    throw new Error('Connection error');
  }
};
