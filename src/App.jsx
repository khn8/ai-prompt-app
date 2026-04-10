import { useState, useRef, useEffect } from 'react';
import ChatMessage from './components/ChatMessage';
import PromptInput from './components/PromptInput';
import { useChatHistory } from './hooks/useChatHistory';
import { fetchAIResponse } from './api/openai';
import './App.css';

function App() {
  // Core UI and request state.
  const [apiKey, setApiKey] = useState(() => localStorage.getItem('openai-api-key') || '');
  const [showSettings, setShowSettings] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  // Persisted chat state from custom hook.
  const { messages, addMessage, clearHistory } = useChatHistory();
  const messagesEndRef = useRef(null);

  // Auto-scroll to the latest message whenever chat history changes.
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Save API key to local storage and close settings drawer.
  const handleSaveKey = (e) => {
    e.preventDefault();
    localStorage.setItem('openai-api-key', apiKey);
    setShowSettings(false);
  };

  // Main send flow: user message -> AI request -> assistant response/error.
  const handleSubmit = async (prompt) => {
    setError(null);
    addMessage('user', prompt);
    setIsLoading(true);

    try {
      const response = await fetchAIResponse(prompt, apiKey);
      addMessage('assistant', response);
    } catch (err) {
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
          <button
            className="settings-btn"
            onClick={() => setShowSettings(!showSettings)}
            title="API Settings"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="3" />
              <path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42" />
            </svg>
          </button>
        </div>
      </header>

      {/* Collapsible settings area for local API key configuration. */}
      {showSettings && (
        <div className="settings-panel">
          <form onSubmit={handleSaveKey}>
            <label htmlFor="api-key">OpenAI API Key</label>
            <div className="settings-row">
              <input
                id="api-key"
                type="password"
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                placeholder="sk-..."
              />
              <button type="submit" className="save-key-btn">Save</button>
            </div>
            <p className="settings-hint">
              Your key is stored locally in your browser.
            </p>
          </form>
        </div>
      )}

      {/* Scrollable conversation area with empty/loading/error states. */}
      <main className="chat-area">
        {messages.length === 0 && !isLoading && (
          <div className="empty-state">
            <div className="empty-icon">💬</div>
            <h2>Start a conversation</h2>
            <p>Type a prompt below to get a response from AI.</p>
            {!apiKey && (
              <p className="empty-hint">
                First, add your OpenAI API key in settings (gear icon above).
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
