import React, { useState, useEffect, useRef } from 'react';
import { MessageSquare, X, Send, Bot, User, Sparkles, HelpCircle } from 'lucide-react';

const Chatbot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { role: 'bot', text: "Hello! I'm Aurora, your TrackaFarm assistant. How can I help you today?", time: new Date() }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const scrollRef = useRef(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isTyping]);

  const handleSend = () => {
    if (!inputValue.trim()) return;

    const userMsg = { role: 'user', text: inputValue, time: new Date() };
    setMessages(prev => [...prev, userMsg]);
    setInputValue('');
    setIsTyping(true);

    // Simple Intent Matching Heuristics
    setTimeout(() => {
      let botResponse = "";
      const input = inputValue.toLowerCase();

      if (input.includes('cow') || input.includes('livestock') || input.includes('animal')) {
        botResponse = "To manage your livestock, head over to the 'Livestock' tab in the sidebar. You can add new animals, track vaccinations, and monitor health telemetry there.";
      } else if (input.includes('milk') || input.includes('yield') || input.includes('production')) {
        botResponse = "You can log daily milk production in the 'Milk Logs' section. Our analytics engine will automatically forecast next week's yield based on this data.";
      } else if (input.includes('finance') || input.includes('payout') || input.includes('money') || input.includes('profit')) {
        botResponse = "The 'Financials' tab lets you track expenses and revenue. You can even generate a professional Cooperative Payout Statement for your records.";
      } else if (input.includes('feed') || input.includes('inventory')) {
        botResponse = "Keep track of your grain and medicine stocks in 'Feed & Inventory'. Use the depletion alerts to know when it's time to reorder.";
      } else if (input.includes('sensor') || input.includes('iot') || input.includes('alert')) {
        botResponse = "Our IoT simulation tracks animal activity and temperature. Look for the pulse icons in the Livestock list—if they turn red, that animal might need medical attention.";
      } else if (input.includes('hello') || input.includes('hi') || input.includes('hey')) {
        botResponse = "Hi there! I can help you navigate the dashboard, understand your analytics, or explain how to log farm activities. What's on your mind?";
      } else {
        botResponse = "I'm still learning! For now, I can help with Livestock, Milk Logs, Finance, and Feed Inventory. Try asking 'How do I check my milk yield?'";
      }

      setMessages(prev => [...prev, { role: 'bot', text: botResponse, time: new Date() }]);
      setIsTyping(false);
    }, 1000);
  };

  const QuickAction = ({ label, onClick }) => (
    <button 
      onClick={onClick}
      style={{
        padding: '0.4rem 0.8rem',
        background: 'var(--glass-white)',
        border: '1px solid var(--glass-border)',
        borderRadius: '8px',
        fontSize: '0.75rem',
        fontWeight: 600,
        color: 'var(--primary-accent)',
        cursor: 'pointer',
        transition: 'all 0.2s ease',
      }}
      onMouseOver={(e) => {
        e.currentTarget.style.background = 'var(--sky-glow)';
        e.currentTarget.style.borderColor = 'var(--primary-accent)';
      }}
      onMouseOut={(e) => {
        e.currentTarget.style.background = 'var(--glass-white)';
        e.currentTarget.style.borderColor = 'var(--glass-border)';
      }}
    >
      {label}
    </button>
  );

  return (
    <>
      {/* Floating Toggle Button */}
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="animate-pop-in"
        style={{
          position: 'fixed',
          bottom: '2rem',
          right: '2rem',
          width: '60px',
          height: '60px',
          borderRadius: '50%',
          background: 'var(--gradient-main)',
          border: 'none',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: 'white',
          boxShadow: '0 8px 32px rgba(0, 229, 255, 0.4)',
          cursor: 'pointer',
          zIndex: 10000,
          transition: 'transform 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
        }}
        onMouseOver={(e) => e.currentTarget.style.transform = 'scale(1.1) rotate(5deg)'}
        onMouseOut={(e) => e.currentTarget.style.transform = 'scale(1) rotate(0deg)'}
      >
        {isOpen ? <X size={28} /> : <MessageSquare size={28} />}
        {!isOpen && (
          <div style={{
            position: 'absolute',
            top: '-5px',
            right: '-5px',
            width: '20px',
            height: '20px',
            background: 'var(--tertiary-accent)',
            borderRadius: '50%',
            border: '2px solid var(--bg-main)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '10px',
            fontWeight: 900
          }}>1</div>
        )}
      </button>

      {/* Chat Window */}
      {isOpen && (
        <div style={{
          position: 'fixed',
          bottom: '6rem',
          right: '2rem',
          width: '380px',
          height: '550px',
          background: 'var(--glass-bg)',
          backdropFilter: 'var(--glass-blur)',
          border: '1px solid var(--glass-border)',
          borderRadius: 'var(--radius-lg)',
          boxShadow: 'var(--card-shadow)',
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden',
          zIndex: 9999,
          animation: 'slideUpFade 0.4s cubic-bezier(0.19, 1, 0.22, 1) both',
        }}>
          {/* Header */}
          <div style={{
            padding: '1.5rem',
            background: 'linear-gradient(135deg, rgba(0,229,255,0.1), rgba(123,44,191,0.1))',
            borderBottom: '1px solid var(--glass-border)',
            display: 'flex',
            alignItems: 'center',
            gap: '1rem',
          }}>
            <div style={{
              width: '40px', height: '40px', borderRadius: '12px',
              background: 'var(--gradient-main)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              boxShadow: '0 0 15px rgba(0,229,255,0.3)',
            }}>
              <Bot size={22} color="white" />
            </div>
            <div>
              <h3 style={{ margin: 0, fontSize: '1rem', fontWeight: 800 }}>Aurora Help</h3>
              <p style={{ margin: 0, fontSize: '0.7rem', color: 'var(--primary-accent)', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                <Sparkles size={10} /> AI Farm Assistant
              </p>
            </div>
          </div>

          {/* Messages Area */}
          <div 
            ref={scrollRef}
            style={{
              flex: 1,
              padding: '1.5rem',
              overflowY: 'auto',
              display: 'flex',
              flexDirection: 'column',
              gap: '1rem',
              scrollbarWidth: 'none',
            }}
          >
            {messages.map((msg, i) => (
              <div 
                key={i} 
                style={{
                  alignSelf: msg.role === 'user' ? 'flex-end' : 'flex-start',
                  maxWidth: '85%',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '0.3rem',
                  animation: 'slideUpFade 0.3s both',
                }}
              >
                <div style={{
                  padding: '0.8rem 1rem',
                  borderRadius: msg.role === 'user' ? '16px 16px 4px 16px' : '16px 16px 16px 4px',
                  background: msg.role === 'user' ? 'var(--primary-accent)' : 'var(--glass-white)',
                  color: msg.role === 'user' ? '#020617' : 'var(--text-primary)',
                  fontSize: '0.9rem',
                  fontWeight: 500,
                  lineHeight: '1.4',
                  boxShadow: msg.role === 'user' ? '0 4px 12px rgba(0,229,255,0.2)' : 'none',
                  border: msg.role === 'bot' ? '1px solid var(--glass-border)' : 'none',
                }}>
                  {msg.text}
                </div>
                <span style={{ 
                  fontSize: '0.65rem', 
                  color: 'var(--text-secondary)', 
                  alignSelf: msg.role === 'user' ? 'flex-end' : 'flex-start',
                  opacity: 0.6
                }}>
                  {msg.time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </span>
              </div>
            ))}
            {isTyping && (
              <div style={{ alignSelf: 'flex-start', display: 'flex', gap: '0.4rem', padding: '0.5rem' }}>
                <div style={{ width: '6px', height: '6px', background: 'var(--primary-accent)', borderRadius: '50%', animation: 'pulseGlowSoft 1s infinite' }} />
                <div style={{ width: '6px', height: '6px', background: 'var(--primary-accent)', borderRadius: '50%', animation: 'pulseGlowSoft 1s infinite 0.2s' }} />
                <div style={{ width: '6px', height: '6px', background: 'var(--primary-accent)', borderRadius: '50%', animation: 'pulseGlowSoft 1s infinite 0.4s' }} />
              </div>
            )}
          </div>

          {/* Quick Actions */}
          <div style={{ 
            padding: '0 1.5rem 1rem', 
            display: 'flex', 
            flexWrap: 'wrap', 
            gap: '0.5rem' 
          }}>
            <QuickAction label="How to log milk?" onClick={() => { setInputValue("How do I log milk production?"); handleSend(); }} />
            <QuickAction label="Check my cows" onClick={() => { setInputValue("Where can I see my livestock?"); handleSend(); }} />
            <QuickAction label="Finance Help" onClick={() => { setInputValue("Tell me about financial tracking"); handleSend(); }} />
          </div>

          {/* Input Area */}
          <div style={{
            padding: '1.25rem',
            borderTop: '1px solid var(--glass-border)',
            background: 'rgba(255,255,255,0.02)',
            display: 'flex',
            gap: '0.75rem',
          }}>
            <input 
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSend()}
              placeholder="Type your message..."
              style={{
                flex: 1,
                background: 'var(--glass-white)',
                border: '1px solid var(--glass-border)',
                borderRadius: '12px',
                padding: '0.75rem 1rem',
                color: 'var(--text-primary)',
                fontSize: '0.85rem',
                outline: 'none',
              }}
            />
            <button 
              onClick={handleSend}
              style={{
                width: '45px',
                height: '45px',
                borderRadius: '12px',
                background: inputValue.trim() ? 'var(--primary-accent)' : 'var(--glass-white)',
                border: 'none',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: inputValue.trim() ? '#020617' : 'rgba(255,255,255,0.2)',
                cursor: inputValue.trim() ? 'pointer' : 'default',
                transition: 'all 0.3s ease',
              }}
            >
              <Send size={18} />
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default Chatbot;
