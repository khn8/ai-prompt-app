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
