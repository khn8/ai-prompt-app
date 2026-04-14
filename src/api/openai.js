// Normalize env values once when module is loaded.
const OPENAI_BASE_URL = (import.meta.env.VITE_OPENAI_BASE_URL || 'https://api.openai.com/v1').replace(/\/+$/, '');
const OPENAI_MODEL = import.meta.env.VITE_OPENAI_MODEL || 'gpt-4o-mini';

// Single API target used by this app (OpenAI-compatible endpoint).
const API_CONFIG = {
  url: `${OPENAI_BASE_URL}/chat/completions`,
  model: OPENAI_MODEL,
  label: 'OpenAI-Compatible',
};

// Sends one prompt to the configured chat completion endpoint
// and returns assistant plain text for UI rendering.
export async function fetchAIResponse(prompt, apiKey) {
  const normalizedKey = apiKey?.trim();

  if (!normalizedKey) {
    throw new Error(`Please enter your ${API_CONFIG.label} API key in settings.`);
  }

  let response;
  try {
    // OpenAI-compatible request shape.
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
    throw new Error(`Network error: unable to reach ${API_CONFIG.label} API. Check your internet connection and try again.`);
  }

  // Handle auth and API errors with actionable messages.
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    if (response.status === 401) {
      throw new Error(`Authentication failed: your ${API_CONFIG.label} API key is invalid.`);
    }
    const message = errorData?.error?.message || `API error: ${response.status}`;
    throw new Error(message);
  }

  // Expected response path: choices[0].message.content
  const data = await response.json();
  const text = data?.choices?.[0]?.message?.content;
  if (!text) throw new Error('API returned an empty response.');
  return text;
}
