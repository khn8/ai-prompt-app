const OPENAI_API_URL = 'https://api.openai.com/v1/chat/completions';

export async function fetchAIResponse(prompt, apiKey) {
  if (!apiKey) {
    throw new Error('Please enter your OpenAI API key in settings.');
  }

  const response = await fetch(OPENAI_API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: 'gpt-3.5-turbo',
      messages: [{ role: 'user', content: prompt }],
      max_tokens: 1024,
      temperature: 0.7,
    }),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    const message = errorData?.error?.message || `API error: ${response.status}`;
    throw new Error(message);
  }

  const data = await response.json();
  return data.choices[0].message.content;
}
