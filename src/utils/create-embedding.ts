import { Configuration, OpenAIApi } from 'openai';

export async function createEmbedding(inputs: string[]): Promise<number[][]> {
  if (!inputs.length) {
    return [];
  }
  const configuration = new Configuration({ apiKey: process.env.OPENAI_API_KEY });
  const openai = new OpenAIApi(configuration);
  const response = await openai.createEmbedding({
    input: inputs,
    model: 'text-embedding-ada-002',
  });
  const tokens = response.data.usage.total_tokens;
  console.log(`Total tokens: ${tokens}`);
  const embeddings = response.data.data.map(embedding => embedding.embedding);
  return embeddings;
}
