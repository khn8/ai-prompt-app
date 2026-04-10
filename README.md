# AI Prompt App

A lightweight React app that lets you input prompts, send them to OpenAI's API, and view responses in a clean chat interface.

## Features

- **Prompt input** — textarea with Enter-to-submit (Shift+Enter for newline)
- **AI responses** — fetches completions from OpenAI (GPT-3.5 Turbo)
- **Loading states** — animated typing indicator while waiting for a response
- **Error handling** — clear error banners for API failures or missing keys
- **Chat history** — conversations persist in localStorage across page reloads
- **Clear button** — wipe the chat history with one click
- **API key management** — enter/update your key via an in-app settings panel (stored locally)

## Setup

### Prerequisites

- [Node.js](https://nodejs.org/) (v18+)
- An [OpenAI API key](https://platform.openai.com/api-keys)

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

1. Click the **gear icon** in the top-right corner of the app.
2. Paste your OpenAI API key (`sk-...`).
3. Click **Save**. The key is stored in your browser's `localStorage` — it never leaves your machine.

## Tech Stack

- **React 19** (via Vite)
- **OpenAI Chat Completions API** (`gpt-3.5-turbo`)
- **CSS** — custom properties, animations, fully responsive
- **localStorage** — for chat history persistence and API key storage

## Project Structure

```
src/
├── api/
│   └── openai.js        # OpenAI API fetch wrapper
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
