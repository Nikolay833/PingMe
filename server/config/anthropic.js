async function askClaude(prompt, maxTokens = 500) {
  const response = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': process.env.ANTHROPIC_API_KEY,
      'anthropic-version': '2023-06-01'
    },
    body: JSON.stringify({
      model: 'claude-sonnet-4-20250514',
      max_tokens: maxTokens,
      messages: [
        { role: 'user', content: prompt }
      ]
    })
  });

  const data = await response.json();

  if (!data.content || !data.content[0]) {
    throw new Error('Invalid response from Claude: ' + JSON.stringify(data));
  }

  return data.content[0].text;
}

module.exports = { askClaude };
