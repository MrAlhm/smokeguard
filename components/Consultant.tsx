
import React, { useState, useRef, useEffect } from 'react';
import { getPolicyAdvice } from '../services/geminiService';
import { ChatMessage } from '../types';

const Consultant: React.FC = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    { role: 'model', text: "Hello, I'm the SmokeGuard AI Policy Consultant. Ask me about BS-VI standards, vehicle maintenance, or emission laws in India. I am built by team Black Dragon." }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim()) return;
    
    const userMsg: ChatMessage = { role: 'user', text: input };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsTyping(true);

    const history = messages.map(m => ({
      role: m.role,
      parts: [{ text: m.text }]
    }));

    const response = await getPolicyAdvice(history, input);
    setMessages(prev => [...prev, { role: 'model', text: response }]);
    setIsTyping(false);
  };

  return (
    <div className="flex flex-col h-[70vh] bg-[#111827] border border-slate-800 rounded-3xl overflow-hidden animate-in zoom-in-95 duration-500">
      <div className="bg-slate-900/50 p-6 border-b border-slate-800 flex items-center gap-4">
        <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center text-xl">🤖</div>
        <div>
          <h2 className="text-lg font-bold">SmokeGuard Policy Advisor</h2>
          <p className="text-xs text-slate-500">Intelligent Environmental Assistant</p>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-6 space-y-4">
        {messages.map((msg, i) => (
          <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[80%] p-4 rounded-2xl text-sm leading-relaxed ${
              msg.role === 'user' 
              ? 'bg-blue-600 text-white rounded-tr-none shadow-lg shadow-blue-900/20' 
              : 'bg-slate-800 text-slate-200 rounded-tl-none border border-slate-700'
            }`}>
              {msg.text}
            </div>
          </div>
        ))}
        {isTyping && (
          <div className="flex justify-start">
            <div className="bg-slate-800 p-4 rounded-2xl rounded-tl-none flex gap-1">
              <div className="w-1.5 h-1.5 bg-slate-500 rounded-full animate-bounce"></div>
              <div className="w-1.5 h-1.5 bg-slate-500 rounded-full animate-bounce delay-75"></div>
              <div className="w-1.5 h-1.5 bg-slate-500 rounded-full animate-bounce delay-150"></div>
            </div>
          </div>
        )}
        <div ref={scrollRef} />
      </div>

      <div className="p-6 bg-slate-900/50 border-t border-slate-800">
        <div className="flex gap-4">
          <input 
            type="text" 
            placeholder="Ask about BS-VI norms, penalty amounts, or engine repair..." 
            className="flex-1 bg-slate-800/50 border border-slate-700 rounded-2xl py-4 px-6 text-sm focus:border-blue-500 focus:outline-none transition-all"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSend()}
          />
          <button 
            onClick={handleSend}
            disabled={isTyping}
            className="bg-blue-600 hover:bg-blue-500 text-white w-14 rounded-2xl flex items-center justify-center transition-all shadow-lg shadow-blue-900/20 disabled:opacity-50"
          >
            🚀
          </button>
        </div>
      </div>
    </div>
  );
};

export default Consultant;
