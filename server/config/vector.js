async function generateGeminiEmbedding(text) {
  const apiKey = process.env.VECTOR_API_KEY;
  const model = "gemini-embedding-001";
  const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:embedContent`;

  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-goog-api-key": apiKey
    },
    body: JSON.stringify({
      model: `models/${model}`,
      taskType: "RETRIEVAL_DOCUMENT", // Best for storing descriptions for future search
      content: {
        parts: [{ text: text }],
      },
    }),
  });

  const data = await response.json();

  if (data.error) {
    throw new Error(`Gemini Embedding Error (${data.error.status}): ${data.error.message}`);
  }

  if (!data.embedding || !data.embedding.values) {
    throw new Error("Invalid response from Gemini Embedding API");
  }

  return data.embedding.values;
}

module.exports = { generateGeminiEmbedding };
