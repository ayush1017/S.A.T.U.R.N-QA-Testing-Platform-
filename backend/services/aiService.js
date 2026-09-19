// import { GoogleGenerativeAI } from '@google/generative-ai';
// import OpenAI from 'openai';

// const provider = process.env.AI_PROVIDER || 'openai';

// // let geminiClient = null;
// let openaiClient = null;

// // function getGeminiClient() {
// //   if (!geminiClient) {
// //     const apiKey = process.env.GEMINI_API_KEY;
// //     if (!apiKey || apiKey === 'your_gemini_api_key_here') {
// //       throw new Error('GEMINI_API_KEY is not configured. Add it to backend/.env');
// //     }
// //     geminiClient = new GoogleGenerativeAI(apiKey);
// //   }
// //   return geminiClient;
// // }

// function getOpenAIClient() {
//   if (!openaiClient) {
//     const apiKey = process.env.OPENAI_API_KEY;
//     if (!apiKey || apiKey === 'your_openai_api_key_here') {
//       throw new Error('OPENAI_API_KEY is not configured. Add it to backend/.env');
//     }
//     openaiClient = new OpenAI({ apiKey });
//   }
//   return openaiClient;
// }

// export async function generateAIResponse(systemPrompt, userPrompt) {
//   if (provider === 'openai') {
//     const client = getOpenAIClient();
//     const response = await client.chat.completions.create({
//       model: 'gpt-4o-mini',
//       messages: [
//         { role: 'system', content: systemPrompt },
//         { role: 'user', content: userPrompt },
//       ],
//       temperature: 0.7,
//     });
//     return response.choices[0].message.content;
//   }

//   // const client = getGeminiClient();
//   // const model = client.getGenerativeModel({
//   //   model: 'gemini-2.0-flash',
//   //   systemInstruction: systemPrompt,
//   // });
//   const result = await model.generateContent(userPrompt);
//   return result.response.text();
// }

// export async function generateJSON(systemPrompt, userPrompt) {
//   const jsonInstruction =
//     '\n\nIMPORTANT: Respond ONLY with valid JSON. No markdown, no code fences, no extra text.';
//   const raw = await generateAIResponse(systemPrompt, userPrompt + jsonInstruction);

//   const cleaned = raw
//     .replace(/```json\s*/gi, '')
//     .replace(/```\s*/g, '')
//     .trim();

//   try {
//     return JSON.parse(cleaned);
//   } catch {
//     throw new Error('AI returned invalid JSON. Please try again.');
//   }
// }

import OpenAI from 'openai';

let client = null;

function getClient() {
  if (!client) {
    const apiKey = process.env.OPENROUTER_API_KEY;

    if (!apiKey) {
      throw new Error(
        'OPENROUTER_API_KEY is not configured. Add it to backend/.env'
      );
    }

    client = new OpenAI({
      apiKey,
      baseURL: 'https://openrouter.ai/api/v1',
    });
  }

  return client;
}

export async function generateAIResponse(systemPrompt, userPrompt) {
  const openrouter = getClient();

  const response = await openrouter.chat.completions.create({
    // Choose any free model available in your OpenRouter account
   model: "google/gemma-3-27b-it",

    messages: [
      {
        role: 'system',
        content: systemPrompt,
      },
      {
        role: 'user',
        content: userPrompt,
      },
    ],

    temperature: 0.7,
  });

  return response.choices[0].message.content;
}

export async function generateJSON(systemPrompt, userPrompt) {
  const jsonInstruction =
    '\n\nIMPORTANT: Respond ONLY with valid JSON. No markdown, no code fences, no extra text.';

  const raw = await generateAIResponse(
    systemPrompt,
    userPrompt + jsonInstruction
  );

  const cleaned = raw
    .replace(/```json\s*/gi, '')
    .replace(/```\s*/g, '')
    .trim();

  try {
    return JSON.parse(cleaned);
  } catch (error) {
    console.error('Invalid JSON:', raw);
    throw new Error('AI returned invalid JSON. Please try again.');
  }
}
