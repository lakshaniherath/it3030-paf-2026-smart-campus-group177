import React, { useState, useRef, useEffect } from 'react';
import './Chatbot.css';

const Chatbot = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState([
        { text: "Hi! I'm the Smart Campus Assistant. How can I help you today?", isBot: true }
    ]);
    const [input, setInput] = useState('');
    const messagesEndRef = useRef(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(scrollToBottom, [messages]);

    const handleSend = async (e) => {
        e.preventDefault();
        if (!input.trim()) return;

        const userMsg = input;
        setMessages([...messages, { text: userMsg, isBot: false }]);
        setInput('');

        try {
            const response = await fetch('http://localhost:8080/api/chatbot/ask', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ question: userMsg })
            });
            const data = await response.json();
            
            setTimeout(() => {
                setMessages(prev => [...prev, { text: data.answer, isBot: true }]);
            }, 500);
        } catch (error) {
            setMessages(prev => [...prev, { text: "Sorry, I'm having trouble connecting to my brain right now.", isBot: true }]);
        }
    };

    const quickActions = ["How do I book a room?", "Report an incident", "Check ticket status"];

    return (
        <div className={`chatbot-wrapper ${isOpen ? 'open' : ''}`}>
            <button className="chat-toggle-btn" onClick={() => setIsOpen(!isOpen)}>
                {isOpen ? '×' : '💬'}
            </button>

            {isOpen && (
                <div className="chat-window">
                    <div className="chat-header">
                        <h4>Campus Assistant</h4>
                        <p>Typically replies instantly</p>
                    </div>
                    <div className="chat-messages">
                        {messages.map((m, i) => (
                            <div key={i} className={`msg-bubble ${m.isBot ? 'bot' : 'user'}`}>
                                {m.text}
                            </div>
                        ))}
                        <div ref={messagesEndRef} />
                    </div>
                    <div className="chat-quick-actions">
                        {quickActions.map(action => (
                            <button key={action} onClick={() => setInput(action)} className="quick-btn">
                                {action}
                            </button>
                        ))}
                    </div>
                    <form className="chat-input" onSubmit={handleSend}>
                        <input 
                            type="text" 
                            placeholder="Type a message..." 
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                        />
                        <button type="submit">Send</button>
                    </form>
                </div>
            )}
        </div>
    );
};

export default Chatbot;