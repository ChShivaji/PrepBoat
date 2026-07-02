import React, { useState, useRef, useEffect } from 'react';
import api from '../services/api';
import { Bot, Send, User, X, RefreshCw, Sparkles, AlertCircle } from 'lucide-react';
import Rudra3DAvatar from './Rudra3DAvatar';


const FloatingChatbot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      content: '**Welcome to PrepBoat!** I am **Rudra**, your placement preparation mentor.\n\nI can answer any coding, SQL, system design, or placement question. Ask me anything to get started!'
    }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const chatEndRef = useRef(null);

  const templates = [
    "Explain closures in JS",
    "Explain SQL joins",
    "What is the GIL in Python?",
    "Explain B-Tree indexing"
  ];

  const scrollToBottom = () => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [messages, loading, isOpen]);

  const handleSend = async (messageText) => {
    const textToSend = messageText || input;
    if (!textToSend.trim()) return;

    setError('');
    const userMsg = { role: 'user', content: textToSend };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setLoading(true);

    try {
      const historyPayload = messages.map(msg => ({
        role: msg.role,
        content: msg.content
      }));

      const res = await api.post('/api/ai/mentor/chat', {
        message: textToSend,
        history: historyPayload
      });

      setMessages(prev => [...prev, { role: 'assistant', content: res.data.response }]);
    } catch (err) {
      console.error("Rudra AI Mentor chat error: ", err);
      setError("Unable to retrieve AI reply. Verify server configuration.");
    } finally {
      setLoading(false);
    }
  };

  const clearChat = () => {
    if (window.confirm("Reset conversation history?")) {
      setMessages([
        {
          role: 'assistant',
          content: 'Chat history reset. Ask Rudra a question to begin a new discussion!'
        }
      ]);
      setError('');
    }
  };

  return (
    <>
      {/* Floating Chat Button and Label Container */}
      <div className="fixed bottom-6 right-6 z-50 flex flex-col items-center gap-1 select-none">
        {/* Floating Button */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className={`w-14 h-14 rounded-full bg-gradient-to-tr from-indigo-500 via-purple-600 to-pink-500 hover:scale-110 active:scale-95 transition-all flex items-center justify-center text-white shadow-xl cursor-pointer border border-white/10 ${isOpen ? 'rotate-90' : ''}`}
          title="Ask Rudra AI Mentor"
        >
          {isOpen ? <X size={24} /> : <Rudra3DAvatar size={34} className="bot-avatar-3d" active={true} />}
        </button>
        {/* Colorful Name Badge Below */}
        <span className="text-[10px] font-extrabold bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 bg-clip-text text-transparent drop-shadow-md">
          Rudra
        </span>
      </div>

      {/* Floating Chat Window */}
      {isOpen && (
        <div className="fixed bottom-24 right-6 w-96 h-[500px] z-50 glass-panel rounded-2xl border border-slate-200 flex flex-col overflow-hidden shadow-2xl bg-white backdrop-blur-md animate-fadeIn">
          {/* Header */}
          <div className="p-4 bg-slate-100/60 border-b border-slate-200 flex items-center justify-between shrink-0">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-indigo-500/10 via-purple-500/10 to-pink-500/10 border border-purple-200 text-purple-600 flex items-center justify-center translate-z-10">
                <Rudra3DAvatar size={22} className="bot-avatar-3d" active={loading} />
              </div>
              <div>
                <h4 className="text-xs font-extrabold bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
                  Rudra - AI Mentor
                </h4>
                <div className="flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                  <span className="text-[9px] text-slate-600">Online</span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={clearChat}
                className="p-1 rounded hover:bg-slate-100 text-slate-600 hover:text-slate-900 transition-all"
                title="Reset Chat"
              >
                <RefreshCw size={12} />
              </button>
              <button
                onClick={() => setIsOpen(false)}
                className="p-1 rounded hover:bg-slate-100 text-slate-600 hover:text-slate-900 transition-all"
                title="Minimize"
              >
                <X size={14} />
              </button>
            </div>
          </div>

          {/* Messages List Area */}
          <div className="flex-1 p-4 overflow-y-auto space-y-4 min-h-0">
            {messages.map((msg, idx) => {
              const isAI = msg.role === 'assistant';
              return (
                <div
                  key={idx}
                  className={`flex gap-2 text-[11px] max-w-[85%] ${isAI ? 'mr-auto' : 'ml-auto flex-row-reverse'}`}
                >
                  <div className={`w-6 h-6 rounded-md flex items-center justify-center shrink-0 border ${
                    isAI
                      ? 'bg-gradient-to-tr from-indigo-500/10 to-purple-500/10 border-indigo-500/20 text-indigo-600'
                      : 'bg-purple-50 border-purple-200 text-purple-600'
                  }`}>
                    {isAI ? <Rudra3DAvatar size={18} className="bot-avatar-3d" active={loading} /> : <User size={12} />}
                  </div>

                  <div className={`p-3 rounded-xl leading-relaxed whitespace-pre-line border ${
                    isAI
                      ? 'bg-slate-50 border-slate-200 text-slate-700'
                      : 'bg-indigo-50 border-indigo-200 text-indigo-950 font-medium'
                  }`}>
                    {msg.content}
                  </div>
                </div>
              );
            })}

            {loading && (
              <div className="flex gap-2 text-[11px] mr-auto items-center">
                <div className="w-6 h-6 rounded-md flex items-center justify-center border bg-indigo-50 border-indigo-500/20 text-indigo-600">
                  <Rudra3DAvatar size={18} className="bot-avatar-3d" active={true} />
                </div>
                <div className="px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-500 italic">
                  Rudra is thinking...
                </div>
              </div>
            )}

            {error && (
              <div className="p-2.5 bg-rose-50 border border-rose-500/20 rounded-xl text-rose-600 text-[10px] flex items-center gap-2 max-w-sm mx-auto">
                <AlertCircle size={12} className="shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <div ref={chatEndRef} />
          </div>

          {/* Quick-Prompt Templates */}
          {messages.length <= 1 && !loading && (
            <div className="px-4 py-2 border-t border-slate-200/40 bg-slate-100/20 shrink-0">
              <p className="text-[9px] font-bold text-slate-500 uppercase tracking-wider mb-2 flex items-center gap-1">
                <Sparkles size={10} className="text-amber-600" />
                <span>Try asking:</span>
              </p>
              <div className="grid grid-cols-2 gap-1.5">
                {templates.map(prompt => (
                  <button
                    key={prompt}
                    onClick={() => handleSend(prompt)}
                    className="p-1.5 rounded-lg border border-slate-200 bg-slate-100/20 text-slate-700 text-left hover:bg-slate-100/60 hover:border-indigo-200 transition-all font-medium text-[10px] truncate"
                  >
                    {prompt}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Input Form */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSend();
            }}
            className="p-3 bg-slate-50 border-t border-slate-200 flex gap-2 shrink-0 text-[11px]"
          >
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask Rudra a question..."
              className="flex-grow px-3 py-2 bg-slate-100/60 border border-slate-200 rounded-lg text-slate-900 focus:outline-none focus:border-indigo-600 focus:ring-1 focus:ring-brandPurple"
            />
            <button
              type="submit"
              disabled={loading || !input.trim()}
              className="px-3 py-2 rounded-lg font-semibold text-white bg-indigo-600 hover:bg-indigo-500 transition-all shrink-0 flex items-center justify-center disabled:opacity-50"
            >
              <Send size={12} />
            </button>
          </form>
        </div>
      )}
    </>
  );
};

export default FloatingChatbot;
