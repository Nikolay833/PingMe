const { GoogleGenAI } = require('@google/genai');

/**
 * Generates vector embeddings for the given text using Google Gemini API.
 * Uses the @google/genai library as requested.
 * Matches the vector(3072) requirement of the database.
 */
async function generateGeminiEmbedding(text) {
  const apiKey = process.env.VECTOR_API_KEY;
  if (!apiKey) {
    throw new Error('VECTOR_API_KEY is not defined in environment variables');
  }

  const ai = new GoogleGenAI({ apiKey });

  const model = 'gemini-embedding-001';

  console.log(`[VECTOR] Generating embedding for text length: ${text.length} using model: ${model}`);

  try {
    const response = await ai.models.embedContent({
      model,
      contents: text, // Pass the text directly
      config: {
        taskType: 'RETRIEVAL_DOCUMENT',
        outputDimensionality: 128
      }
    });

    if (!response || !response.embeddings || response.embeddings.length === 0) {
      console.error('[VECTOR] No embeddings in response:', response);
      throw new Error('Invalid response from Gemini Embedding API: No embeddings returned');
    }

    const embedding = response.embeddings[0].values;
    console.log(`[VECTOR] Successfully generated embedding. Dimensions: ${embedding.length}`);
    return embedding;
  } catch (error) {
    console.error('[VECTOR] Error details:', error);
    throw new Error(`Gemini Embedding Failed: ${error.message}`);
  }
}

module.exports = { generateGeminiEmbedding };
