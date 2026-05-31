import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import './ChatBot.css';
import { useLanguage } from '../../context/LanguageContext';
import { formatPrice, toSlug } from '../../utils';

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
          timestamp: new Date(),
          products: Array.isArray(data.products) ? data.products : []
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

  const splitMessage = (text) => {
    const lines = String(text || '')
      .split('\n')
      .map((line) => line.trim())
      .filter(Boolean);

    const paragraphs = [];
    const items = [];

    lines.forEach((line) => {
      if (line.startsWith('- ') || line.startsWith('• ')) {
        items.push(line.replace(/^[-•]\s*/, ''));
      } else {
        paragraphs.push(line);
      }
    });

    return { paragraphs, items };
  };

  const getProductLink = (product) => {
    const id = product?.id || product?._id;
    if (!id) return '';
    const slug = toSlug(product?.name || 'product') || 'product';
    return `/product-details/${id}/${slug}`;
  };

  const renderProductCards = (products = []) => {
    if (!Array.isArray(products) || products.length === 0) return null;

    return (
      <div className="message-products">
        {products.map((product, index) => {
          const id = product?.id || product?._id;
          const name = product?.name || 'Product';
          const imageUrl = product?.image || (Array.isArray(product?.images) ? product.images[0] : '');
          const link = getProductLink(product);
          const priceLabel = typeof product?.price === 'number' ? formatPrice(product.price) : '';
          const discount = typeof product?.discount === 'number' ? product.discount : null;
          const stockLabel = typeof product?.countInStock === 'number'
            ? `Stock: ${product.countInStock}`
            : '';

          const content = (
            <>
              <div className="message-product-image">
                {imageUrl ? (
                  <img src={imageUrl} alt={name} loading="lazy" />
                ) : (
                  <div className="message-product-image-placeholder" aria-label="No image" />
                )}
              </div>
              <div className="message-product-content">
                <div className="message-product-title">{name}</div>
                <div className="message-product-meta">
                  {priceLabel && <span className="message-product-chip">{priceLabel}</span>}
                  {product?.type && <span className="message-product-chip">{product.type}</span>}
                  {discount > 0 && <span className="message-product-chip">-{discount}%</span>}
                  {stockLabel && <span className="message-product-chip">{stockLabel}</span>}
                </div>
                {id && <span className="message-product-link">View details</span>}
              </div>
            </>
          );

          return id ? (
            <Link key={`${id}-${index}`} to={link} className="message-product-card">
              {content}
            </Link>
          ) : (
            <div key={`${name}-${index}`} className="message-product-card">
              {content}
            </div>
          );
        })}
      </div>
    );
  };

  const renderMessageContent = (msg) => {
    if (msg.sender !== 'bot') {
      return <p className="message-text">{msg.text}</p>;
    }

    const { paragraphs, items } = splitMessage(msg.text);

    if (!paragraphs.length && !items.length) {
      return <p className="message-text">{msg.text}</p>;
    }

    return (
      <>
        {paragraphs.map((paragraph, index) => (
          <p key={`p-${index}`} className="message-text">{paragraph}</p>
        ))}
        {items.length > 0 && (
          <ul className="message-list">
            {items.map((item, index) => {
              const columns = item.split('|').map((part) => part.trim()).filter(Boolean);
              if (columns.length <= 1) {
                return (
                  <li key={`i-${index}`} className="message-list-item">
                    <span className="message-list-title">{item}</span>
                  </li>
                );
              }

              return (
                <li key={`i-${index}`} className="message-list-item">
                  <div className="message-list-row">
                    <span className="message-list-title">{columns[0]}</span>
                    <div className="message-list-meta">
                      {columns.slice(1).map((column, colIndex) => (
                        <span key={`c-${index}-${colIndex}`} className="message-list-chip">{column}</span>
                      ))}
                    </div>
                  </div>
                </li>
              );
            })}
          </ul>
        )}
        {renderProductCards(msg.products)}
      </>
    );
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
                  {renderMessageContent(msg)}
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
