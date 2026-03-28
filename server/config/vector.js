const { GoogleGenAI } = require('@google/genai');

async function generateGeminiEmbedding(text) {
  const apiKey = process.env.VECTOR_API_KEY;
  if (!apiKey) {
    throw new Error('VECTOR_API_KEY is not defined in environment variables');
  }

  const ai = new GoogleGenAI({ apiKey });

  const model = 'gemini-embedding-001';

  try {
    const response = await ai.models.embedContent({
      model,
      contents: [{ parts: [{ text }] }],
      config: {
        taskType: 'RETRIEVAL_DOCUMENT',
        outputDimensionality: 64
      }
    });

    if (!response || !response.embeddings || response.embeddings.length === 0) {
      throw new Error('No embeddings returned from API');
    }

    const embedding = response.embeddings[0].values;
    return embedding;
  } catch (error) {
    throw new Error(`Gemini Embedding Failed: ${error.message}`);
  }
}

module.exports = { generateGeminiEmbedding };
