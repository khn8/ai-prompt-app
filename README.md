# AI Prompt App

A lightweight React app that sends prompts to an OpenAI-compatible chat-completions endpoint and renders responses in a clean chat UI.

## Features

- **Prompt input** — textarea with Enter-to-submit (Shift+Enter for newline)
- **AI responses** — sends requests to a configurable OpenAI-compatible endpoint
- **Loading states** — animated typing indicator while waiting for a response
- **Error handling** — clear error banners for missing key, auth, network, and API errors
- **Chat history** — conversations persist in localStorage across page reloads
- **Clear button** — wipe the chat history with one click
- **Environment-based config** — API key/model/base URL are read from `.env` (not editable in UI)

## Setup

### Prerequisites

- [Node.js](https://nodejs.org/) (v18+)
- An API key for your OpenAI-compatible provider

### Install & Run

```bash
# Clone the repo
git clone https://github.com/<your-username>/ai-prompt-app.git
cd ai-prompt-app

# Install dependencies
npm install

# Start the dev server
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

### Configure your API key

1. Create a `.env` file in the project root (or copy from `.env.example`).
2. Add your values:

```bash
VITE_API_KEY=your_api_key_here
VITE_OPENAI_BASE_URL=https://aiapiv2.pekpik.com/v1
VITE_OPENAI_MODEL=deepseek-chat
```

3. Restart the dev server after changing `.env`.

## Error Handling

The app surfaces errors through a red banner in the chat area. Two layers of handling cover different failure modes:

- **Network failures** (offline, DNS, CORS) — caught by a `try/catch` around `fetch`, shown as "Network error: unable to reach ... API."
- **HTTP error responses** — caught by checking `response.ok`:
  - **`401 Unauthorized`** — explicit message: "Authentication failed: your API key is invalid."
  - **All other non-2xx codes** (`400`, `403`, `429`, `5xx`, etc.) — fall through to a generic handler that surfaces the provider's error message when available, or `API error: <status>` as a fallback.
- **Empty/malformed responses** — if the response parses but lacks `choices[0].message.content`, the app throws "API returned an empty response."

## Known Limitations / Not Yet Implemented

These are intentional gaps in the current version — documented here so they're easy to pick up next:

- **No `AbortController`** — if a user sends a second prompt before the first finishes, the requests can race. The textarea is disabled during loading as a temporary workaround.
- **No retry logic** — network and `5xx` failures are not retried automatically. A production version should retry with exponential backoff (e.g. 1s, 2s, 4s) and skip retries for `4xx` client errors.
- **No streaming responses** — responses arrive as a single block after the full completion. Streaming (`stream: true` + SSE parsing) would improve perceived latency.
- **No conversation context** — each prompt is sent independently; the AI has no memory of earlier turns. To fix, send the full message history in the `messages` array and handle token limits.
- **API key is exposed to the browser** — `VITE_API_KEY` is inlined into the bundle at build time, so anyone viewing source can extract it. For production, the key must live behind a backend proxy.
- **Single conversation only** — no sidebar, no way to start a new chat while preserving old ones. Multi-conversation support would require restructuring `useChatHistory` into a `useConversations` hook.
- **No multi-tab sync** — two tabs open at once keep independent in-memory state and will overwrite each other's localStorage writes. A `storage` event listener would fix this.
- **No schema versioning on persisted data** — if the message shape changes, old localStorage entries will break. Wrapping the stored blob as `{ version: 1, messages: [...] }` would allow migrations.
- **`Date.now()` as message id** — two messages added in the same millisecond collide. `crypto.randomUUID()` is the safer choice.
- **No automated tests** — unit tests for `useChatHistory` and `fetchAIResponse`, plus an integration test for the send flow, would be the first additions.
- **No TypeScript** — the project uses plain JavaScript. TypeScript would catch API-shape mismatches at compile time.
- **Auto-scroll yanks the user down** — scrolling up to read older messages gets interrupted whenever a new message arrives. A "near the bottom" check would make this less disruptive.

## Tech Stack

- **React 19** (via Vite)
- **OpenAI-compatible Chat Completions API**
- **CSS** — custom properties, animations, fully responsive
- **localStorage** — for chat history persistence only

## Project Structure

```
src/
├── api/
│   └── openai.js         # OpenAI-compatible API request wrapper
├── components/
│   ├── ChatMessage.jsx   # Individual message bubble
│   ├── ChatMessage.css
│   ├── PromptInput.jsx   # Textarea + submit button
│   └── PromptInput.css
├── hooks/                
│   └── useChatHistory.js # Chat state + localStorage persistence
├── App.jsx               # Main app layout and logic
├── App.css
├── index.css             # Global reset and CSS variables
└── main.jsx              # Entry point
```
