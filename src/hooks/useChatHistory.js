import { useState, useCallback } from 'react';

// Persistent storage bucket for the full message timeline.
const STORAGE_KEY = 'ai-prompt-chat-history';

// Read cached history once during hook initialization.
function loadHistory() {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
}

// Persist the latest snapshot after each mutation.
function saveHistory(history) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(history));
}

// Encapsulates chat state + persistence mechanics.
export function useChatHistory() {
  const [messages, setMessages] = useState(loadHistory);

  // Append a new message entry and keep localStorage in sync.
  const addMessage = useCallback((role, content) => {
    setMessages((prev) => {
      const updated = [...prev, { id: Date.now(), role, content, timestamp: new Date().toISOString() }];
      saveHistory(updated);
      return updated;
    });
  }, []);

  // Reset both in-memory and persisted chat history.
  const clearHistory = useCallback(() => {
    setMessages([]);
    localStorage.removeItem(STORAGE_KEY);
  }, []);

  return { messages, addMessage, clearHistory };
}
