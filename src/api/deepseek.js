// DeepSeek gateway settings are read from `.env` at build/dev startup.
const DEEPSEEK_BASE_URL = (import.meta.env.VITE_DEEPSEEK_BASE_URL || 'https://aiapiv2.pekpik.com/v1').replace(/\/+$/, '');
const DEEPSEEK_MODEL = import.meta.env.VITE_DEEPSEEK_MODEL || 'deepseek-chat';

const API_CONFIG = {
  url: `${DEEPSEEK_BASE_URL}/chat/completions`,
  model: DEEPSEEK_MODEL,
  label: 'DeepSeek',
};

// Sends prompt to DeepSeek-compatible chat completions endpoint.
export async function fetchAIResponse(prompt, apiKey) {
  const normalizedKey = apiKey?.trim();

  if (!normalizedKey) {
    throw new Error('Please add your DeepSeek API key in the .env file.');
  }

  let response;
  try {
    response = await fetch(API_CONFIG.url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${normalizedKey}`,
      },
      body: JSON.stringify({
        model: API_CONFIG.model,
        messages: [{ role: 'user', content: prompt }],
        max_tokens: 1024,
        temperature: 0.7,
      }),
    });
  } catch {
    throw new Error('Network error: unable to reach DeepSeek API. Check your internet connection and try again.');
  }

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    if (response.status === 401) {
      throw new Error('Authentication failed: your DeepSeek API key is invalid.');
    }
    const message = errorData?.error?.message || `API error: ${response.status}`;
    throw new Error(message);
  }

  const data = await response.json();
  const text = data?.choices?.[0]?.message?.content;
  if (!text) throw new Error('API returned an empty response.');
  return text;
}
