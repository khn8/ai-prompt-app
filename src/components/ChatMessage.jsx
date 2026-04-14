import './ChatMessage.css';

// Stateless renderer for one chat row (user or assistant).
function ChatMessage({ message }) {
  // Role drives both styling and avatar/label text.
  const isUser = message.role === 'user';

  return (
    <div className={`chat-message ${isUser ? 'user' : 'assistant'}`}>
      <div className="message-avatar">
        {isUser ? '👤' : '🤖'}
      </div>
      <div className="message-content">
        <span className="message-role">{isUser ? 'You' : 'AI'}</span>
        <p className="message-text">{message.content}</p>
      </div>
    </div>
  );
}

export default ChatMessage;
