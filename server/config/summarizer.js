async function summarizeDescription(prompt, maxTokens = 10) {
  const apiKey = process.env.AI_API_KEY;
  const url = "https://openrouter.ai/api/v1/chat/completions";

  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: "stepfun/step-3.5-flash:free",
      max_tokens: maxTokens,
      messages: [
        { role: "system", content: "Summarize the given description into 10 characters or less." },
        { role: "user", content: prompt }
      ]
    })
  });

  const data = await response.json();

  if (data.error) {
    throw new Error("Summarizer Error: " + (data.error.message || JSON.stringify(data.error)));
  }

  if (!data.choices || !data.choices[0]) {
    throw new Error("Invalid response from Summarizer: " + JSON.stringify(data));
  }

  return data.choices[0].message.content.trim();
}

module.exports = { summarizeDescription };
