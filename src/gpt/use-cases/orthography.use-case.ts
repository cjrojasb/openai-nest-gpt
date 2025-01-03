import OpenAI from 'openai';

interface Options {
  prompt: string;
}

export const orthographyCheckUseCase = async (
  openai: OpenAI,
  { prompt }: Options,
) => {
  try {
    const completion = await openai.chat.completions.create({
      model: 'gpt-4o',
      messages: [
        {
          role: 'system',
          content: `Te serán proveídos textos en español, con posibles errores ortográficos y gramaticales, Debes de responder en formato JSON, tu tarea es corregirlos y retornar información con soluciones, también debes de dar un porcentaje de acierto por el usuario, Si no hay errores, debes de retornar un mensaje alegre de felicitaciones en ingles
          
          Ejemplo de salida:

          {
            userScore: number,
            errors: string[], // ['error => solución'],
            message: string // Usa emojis y texto para felicitar al usuario recuerda en ingles
          }
          `,
        },
        {
          role: 'user',
          content: prompt,
        },
      ],
      temperature: 0.3,
      max_tokens: 100,
      response_format: {
        type: 'json_object',
      },
    });

    return JSON.parse(completion.choices[0].message.content);
  } catch (error) {
    console.error('Error:', error);
    throw new Error('Connection error');
  }
};
