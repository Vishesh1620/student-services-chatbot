import React from 'react';
import './FloatingChatButton.css';

const FloatingChatButton = ({ onClick }) => {
  return (
    <button className="floating-chat-button" onClick={onClick}>
      <span className="chat-icon">💬</span>
      <span className="chat-text">Chat</span>
    </button>
  );
};

export default FloatingChatButton;
