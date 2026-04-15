import { useState, useRef, useEffect } from 'react';
import ChatMessage from './components/ChatMessage';
import PromptInput from './components/PromptInput';
import { useChatHistory } from './hooks/useChatHistory';
import { fetchAIResponse } from './api/deepseek';
import './App.css';

// Runtime config is read-only and sourced from `.env` via Vite.
const ENV_API_KEY = import.meta.env.VITE_API_KEY || '';

function App() {
  // Core UI and request state.
  const apiKey = ENV_API_KEY.trim();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  // Persisted chat state from custom hook.
  const { messages, addMessage, clearHistory } = useChatHistory();
  const messagesEndRef = useRef(null);

  // Auto-scroll to the latest message whenever chat history changes.
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Main send flow: user message -> AI request -> assistant response/error.
  const handleSubmit = async (prompt) => {
    // Optimistically render the user message so UI feels immediate.
    setError(null);
    addMessage('user', prompt);
    setIsLoading(true);

    try {
      const response = await fetchAIResponse(prompt, apiKey);
      addMessage('assistant', response);
    } catch (err) {
      // Surface a user-readable message in the error banner.
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  // Clear message history and transient error state.
  const handleClear = () => {
    clearHistory();
    setError(null);
  };

  return (
    <div className="app">
      {/* Top bar with app title and quick actions. */}
      <header className="app-header">
        <h1>AI Prompt App</h1>
        <div className="header-actions">
          <button
            className="clear-btn"
            onClick={handleClear}
            disabled={messages.length === 0}
            title={messages.length === 0 ? 'No messages to clear' : 'Clear chat history'}
          >
            Clear Chat
          </button>
        </div>
      </header>

      {/* Scrollable conversation area with empty/loading/error states. */}
      <main className="chat-area">
        {messages.length === 0 && !isLoading && (
          <div className="empty-state">
            <div className="empty-icon">💬</div>
            <h2>Start a conversation</h2>
            <p>Type a prompt below to get a response from AI.</p>
            {!apiKey && (
              <p className="empty-hint">
                First, add `VITE_API_KEY` to your `.env` file and restart the dev server.
              </p>
            )}
          </div>
        )}

        {messages.map((msg) => (
          <ChatMessage key={msg.id} message={msg} />
        ))}

        {isLoading && (
          <div className="chat-message assistant loading-message">
            <div className="message-avatar">🤖</div>
            <div className="message-content">
              <span className="message-role">AI</span>
              <div className="typing-indicator">
                <span /><span /><span />
              </div>
            </div>
          </div>
        )}

        {error && (
          <div className="error-banner">
            <strong>Error:</strong> {error}
          </div>
        )}

        <div ref={messagesEndRef} />
      </main>

      {/* Bottom prompt composer for sending new user messages. */}
      <PromptInput onSubmit={handleSubmit} isLoading={isLoading} />
    </div>
  );
}

export default App;
