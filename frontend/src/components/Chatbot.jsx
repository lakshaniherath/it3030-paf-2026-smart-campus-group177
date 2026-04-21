import React, { useState, useEffect, useRef } from 'react';
import { FiMessageCircle, FiX, FiSend } from 'react-icons/fi';

const Chatbot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      id: 1,
      text: "Hi! I'm the Smart Campus Assistant. How can I help you today?",
      sender: 'bot',
      timestamp: new Date()
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (isOpen) {
      setUnreadCount(0);
    }
  }, [isOpen]);

  const handleSendMessage = async () => {
    if (inputValue.trim() === '') return;

    // Add user message
    const userMessage = {
      id: messages.length + 1,
      text: inputValue,
      sender: 'user',
      timestamp: new Date()
    };

    setMessages([...messages, userMessage]);
    setInputValue('');
    setIsLoading(true);

    try {
      const response = await fetch('http://localhost:8080/api/chatbot/ask', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ question: inputValue })
      });

      const data = await response.json();

      if (data.status === 'success') {
        const botMessage = {
          id: messages.length + 2,
          text: data.answer,
          sender: 'bot',
          timestamp: new Date()
        };
        setMessages(prev => [...prev, botMessage]);
      } else {
        const errorMessage = {
          id: messages.length + 2,
          text: "Sorry, I couldn't process that. Please try again.",
          sender: 'bot',
          timestamp: new Date()
        };
        setMessages(prev => [...prev, errorMessage]);
      }
    } catch (error) {
      console.error('Chatbot error:', error);
      const errorMessage = {
        id: messages.length + 2,
        text: "Sorry, I'm having trouble connecting. Please try again later.",
        sender: 'bot',
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const quickQuestions = [
    "How do I book a resource?",
    "How do I report an incident?",
    "How do I track my ticket?",
    "How do I log in with Google?"
  ];

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {/* Chatbot Toggle Button */}
      <button
        className={`w-16 h-16 rounded-full bg-cyan-500 text-white shadow-lg hover:shadow-xl transition-all flex items-center justify-center relative ${
          isOpen ? 'scale-95' : 'hover:scale-110'
        }`}
        onClick={() => setIsOpen(!isOpen)}
        title="Chat Assistant"
      >
        <FiMessageCircle size={24} />
        {unreadCount > 0 && (
          <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold w-6 h-6 rounded-full flex items-center justify-center animate-pulse">
            {unreadCount}
          </span>
        )}
      </button>

      {/* Chatbot Window */}
      {isOpen && (
        <div className="absolute bottom-20 right-0 w-96 h-screen md:h-96 md:max-h-96 rounded-[1.5rem] border border-white/10 bg-slate-950 shadow-2xl flex flex-col animate-in slide-in-from-bottom-5 duration-300 overflow-hidden">
          {/* Header */}
          <div className="bg-slate-900 text-white p-4 flex justify-between items-start border-b border-white/10">
            <div>
              <h3 className="font-bold text-lg">Smart Campus Assistant</h3>
              <p className="text-sm opacity-90">Always here to help</p>
            </div>
            <button
              className="hover:bg-white hover:bg-opacity-20 p-1 rounded transition"
              onClick={() => setIsOpen(false)}
              title="Close chat"
            >
              <FiX size={20} />
            </button>
          </div>

          {/* Messages Container */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-slate-950">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'} gap-2 animate-in fade-in slide-in-from-bottom-2 duration-300`}
              >
                {msg.sender === 'bot' && (
                  <div className="text-2xl flex-shrink-0">🤖</div>
                )}
                <div
                  className={`max-w-xs px-4 py-2 rounded-lg ${
                    msg.sender === 'user'
                      ? 'bg-cyan-500 text-white rounded-br-none'
                      : 'bg-white/5 border border-white/10 text-slate-100 rounded-bl-none'
                  }`}
                >
                  <p className="text-sm">{msg.text}</p>
                  <span className={`text-xs ${msg.sender === 'user' ? 'opacity-70' : 'text-gray-500'} mt-1 block`}>
                    {msg.timestamp.toLocaleTimeString([], {
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </span>
                </div>
                {msg.sender === 'user' && (
                  <div className="text-2xl flex-shrink-0">👤</div>
                )}
              </div>
            ))}

            {isLoading && (
              <div className="flex justify-start gap-2">
                <div className="text-2xl">🤖</div>
                <div className="bg-white/5 border border-white/10 px-4 py-2 rounded-lg rounded-bl-none flex gap-1">
                  <span className="w-2 h-2 bg-cyan-300 rounded-full animate-bounce"></span>
                  <span className="w-2 h-2 bg-cyan-300 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></span>
                  <span className="w-2 h-2 bg-cyan-300 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></span>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Quick Questions */}
          {messages.length <= 1 && (
            <div className="px-4 py-3 border-t border-white/10 bg-slate-950">
              <p className="text-xs font-semibold text-slate-400 mb-2">Popular questions:</p>
              <div className="space-y-2">
                {quickQuestions.map((q, idx) => (
                  <button
                    key={idx}
                    className="w-full text-left text-sm px-3 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-slate-100 border border-white/10 transition"
                    onClick={() => {
                      setInputValue(q);
                      setTimeout(() => handleSendMessage(), 100);
                    }}
                  >
                    {q}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Input Area */}
          <div className="flex gap-2 p-4 border-t border-white/10 bg-slate-950">
            <input
              type="text"
              placeholder="Ask me anything..."
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyPress={(e) => {
                if (e.key === 'Enter' && !isLoading) {
                  handleSendMessage();
                }
              }}
              disabled={isLoading}
              className="flex-1 px-3 py-2 rounded-xl border border-white/10 bg-white/5 text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-cyan-400/20 focus:border-cyan-400/40 disabled:opacity-50"
            />
            <button
              className="px-4 py-2 bg-cyan-400 text-slate-950 rounded-xl hover:opacity-90 transition disabled:opacity-50"
              onClick={handleSendMessage}
              disabled={isLoading || inputValue.trim() === ''}
              title="Send message"
            >
              <FiSend size={18} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Chatbot;
