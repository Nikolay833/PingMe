const { GoogleGenAI } = require('@google/genai');

/**
 * Generates vector embeddings for the given text using Google Gemini API.
 * Uses the @google/genai library as requested.
 * Matches the vector(64) requirement of the database.
 */
async function generateGeminiEmbedding(text) {
  const apiKey = process.env.VECTOR_API_KEY;
  if (!apiKey) {
    throw new Error('VECTOR_API_KEY is not defined in environment variables');
  }

  // Use the standard initialization
  const ai = new GoogleGenAI({ apiKey });

  // Reverting to the model that was confirmed reachable in your environment
  const model = 'gemini-embedding-001'; 

  console.log(`[VECTOR V5] Generating embedding for text length: ${text.length} using model: ${model}`);

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
    console.log(`[VECTOR V5] Successfully generated embedding. Dimensions: ${embedding.length}`);
    return embedding;
  } catch (error) {
    console.error('[VECTOR V5] Error details:', error);
    throw new Error(`Gemini Embedding Failed: ${error.message}`);
  }
}

module.exports = { generateGeminiEmbedding };
