import { useState, useCallback } from 'react';

const STORAGE_KEY = 'ai-prompt-chat-history';

function loadHistory() {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
}

function saveHistory(history) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(history));
}

export function useChatHistory() {
  const [messages, setMessages] = useState(loadHistory);

  const addMessage = useCallback((role, content) => {
    setMessages((prev) => {
      const updated = [...prev, { id: Date.now(), role, content, timestamp: new Date().toISOString() }];
      saveHistory(updated);
      return updated;
    });
  }, []);

  const clearHistory = useCallback(() => {
    setMessages([]);
    localStorage.removeItem(STORAGE_KEY);
  }, []);

  return { messages, addMessage, clearHistory };
}
