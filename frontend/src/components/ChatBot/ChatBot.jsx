import React, { useState, useEffect, useRef } from 'react';
import './ChatBot.css';
import { useLanguage } from '../../context/LanguageContext';

const ChatBot = () => {
  const { language, t } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { 
      text: t('chatbot.welcome'), 
      sender: 'bot', 
      timestamp: new Date() 
    }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const sendMessage = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMessage = { text: input, sender: 'user', timestamp: new Date() };
    setMessages(prev => [...prev, userMessage]);
    const currentInput = input;
    setInput('');
    setIsTyping(true);

    try {
      // Gọi API backend ChatBot (OpenRouter)
      const response = await fetch('http://localhost:3001/api/chatbot/message', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: currentInput })
      });

      const data = await response.json();
      
      if (data.success) {
        const botMessage = { 
          text: data.reply, 
          sender: 'bot', 
          timestamp: new Date() 
        };
        setMessages(prev => [...prev, botMessage]);
      } else {
        throw new Error(data.message);
      }
    } catch (error) {
      console.error('Error:', error);
      setMessages(prev => [...prev, { 
        text: t('chatbot.error'), 
        sender: 'bot',
        timestamp: new Date()
      }]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage(e);
    }
  };

  return (
    <>
      {/* Chat Bubble Button */}
      <div 
        className={`chat-bubble ${isOpen ? 'open' : ''}`}
        onClick={() => setIsOpen(!isOpen)}
        title={t('chatbot.title')}
      >
        {isOpen ? '✕' : '💬'}
      </div>

      {/* Chat Window */}
      {isOpen && (
        <div className="chat-window">
          <div className="chat-header">
            <div className="chat-header-content">
              <span className="chat-bot-avatar">🤖</span>
              <div className="chat-header-text">
                <h3>TechStore Chatbot</h3>
                <p className="chat-status">{t('chatbot.active')}</p>
              </div>
            </div>
            <button className="chat-close-btn" onClick={() => setIsOpen(false)}>✕</button>
          </div>

          <div className="chat-messages">
            {messages.map((msg, index) => (
              <div key={index} className={`message ${msg.sender}`}>
                {msg.sender === 'bot' && <span className="message-avatar">🤖</span>}
                <div className="message-bubble">
                  <p>{msg.text}</p>
                  <span className="message-time">
                    {msg.timestamp.toLocaleTimeString(language === 'vi' ? 'vi-VN' : 'en-US', {
                      hour: '2-digit', 
                      minute: '2-digit' 
                    })}
                  </span>
                </div>
                {msg.sender === 'user' && <span className="message-avatar">👤</span>}
              </div>
            ))}
            {isTyping && (
              <div className="message bot">
                <span className="message-avatar">🤖</span>
                <div className="message-bubble typing-indicator">
                  <span></span>
                  <span></span>
                  <span></span>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          <form className="chat-input" onSubmit={sendMessage}>
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder={t('chatbot.inputPlaceholder')}
              disabled={isTyping}
              autoComplete="off"
            />
            <button type="submit" disabled={isTyping || !input.trim()}>
              <span className="send-icon">📤</span>
            </button>
          </form>
        </div>
      )}
    </>
  );
};

export default ChatBot;
