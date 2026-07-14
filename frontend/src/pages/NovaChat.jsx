import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Bot, Send, User, Sparkles, Trash2 } from 'lucide-react';
import GlassCard from '../components/GlassCard';
import axios from 'axios';

const WELCOME_MESSAGE = { role: 'nova', content: "Hi! I'm **NOVA**, your personal AI career mentor 🚀\n\nI can help you with:\n- 🎯 Career path guidance\n- 📚 Learning roadmaps\n- 💼 Interview preparation\n- 🔍 Skill gap analysis\n\nWhat would you like to explore today?" };

function MessageContent({ content }) {
  // Simple markdown-like rendering
  const lines = content.split('\n');
  return (
    <div className="space-y-1">
      {lines.map((line, i) => {
        if (line.startsWith('- ')) {
          return <p key={i} className="flex gap-2 text-slate-200 text-sm"><span>{line.slice(2)}</span></p>;
        }
        // Bold text
        const parts = line.split(/\*\*(.*?)\*\*/g);
        return (
          <p key={i} className="text-slate-200 text-sm leading-relaxed">
            {parts.map((part, j) => j % 2 === 1 ? <strong key={j} className="text-white font-semibold">{part}</strong> : part)}
          </p>
        );
      })}
    </div>
  );
}

export default function NovaChat() {
  const [messages, setMessages] = useState([WELCOME_MESSAGE]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  const handleSend = async (e) => {
    e?.preventDefault();
    const userMsg = input.trim();
    if (!userMsg || loading) return;

    const newMessages = [...messages, { role: 'user', content: userMsg }];
    setMessages(newMessages);
    setInput('');
    setLoading(true);

    try {
      // Send full history for context-aware responses
      const history = newMessages.slice(1).map(m => ({
        role: m.role === 'user' ? 'user' : 'nova',
        content: m.content
      }));

      const res = await axios.post('http://localhost:5000/api/ai/chat', {
        message: userMsg,
        history: history.slice(0, -1) // all except the last user message
      });
      setMessages(prev => [...prev, { role: 'nova', content: res.data.reply }]);
    } catch (error) {
      console.error(error);
      setMessages(prev => [...prev, {
        role: 'nova',
        content: "⚠️ I'm having trouble connecting to the server. Make sure the backend is running on port 5000."
      }]);
    } finally {
      setLoading(false);
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  };

  const handleSuggestion = (text) => {
    setInput(text);
    inputRef.current?.focus();
  };

  const clearChat = () => setMessages([WELCOME_MESSAGE]);

  const suggestions = [
    "How do I become a Data Scientist?",
    "What skills do I need for AI engineering?",
    "Create a 6-month learning plan for web dev",
    "Help me prepare for a software interview",
  ];

  return (
    <div className="max-w-4xl mx-auto p-4 md:p-6 mt-4 h-[calc(100vh-110px)] flex flex-col gap-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gradient flex items-center gap-2">
            <Sparkles className="w-6 h-6 text-primary" /> NOVA AI Mentor
          </h1>
          <p className="text-xs text-slate-400 mt-0.5">Powered by Gemini 2.0 Flash</p>
        </div>
        <button
          onClick={clearChat}
          className="flex items-center gap-1.5 text-xs text-slate-400 hover:text-rose-400 transition-colors px-3 py-1.5 rounded-lg hover:bg-rose-400/10"
        >
          <Trash2 className="w-3.5 h-3.5" /> Clear Chat
        </button>
      </div>

      {/* Chat Area */}
      <GlassCard className="flex-grow flex flex-col overflow-hidden !p-0 min-h-0">
        <div className="flex-grow overflow-y-auto p-4 md:p-6 space-y-4 scrollbar-thin">
          <AnimatePresence initial={false}>
            {messages.map((msg, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 12, scale: 0.97 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ duration: 0.25 }}
                className={`flex gap-3 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}
              >
                {/* Avatar */}
                <div className={`w-9 h-9 rounded-full flex items-center justify-center shrink-0 shadow-lg ${
                  msg.role === 'user' ? 'bg-gradient-to-br from-secondary to-primary' : 'bg-gradient-to-br from-primary to-accent'
                }`}>
                  {msg.role === 'user'
                    ? <User className="text-white w-4 h-4" />
                    : <Bot className="text-slate-900 w-5 h-5" />
                  }
                </div>

                {/* Bubble */}
                <div className={`max-w-[78%] rounded-2xl px-4 py-3 shadow-md ${
                  msg.role === 'user'
                    ? 'bg-gradient-to-br from-secondary/25 to-primary/25 border border-primary/20 rounded-tr-sm'
                    : 'bg-slate-800/80 border border-white/5 rounded-tl-sm'
                }`}>
                  <MessageContent content={msg.content} />
                </div>
              </motion.div>
            ))}
          </AnimatePresence>

          {/* Typing indicator */}
          {loading && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex gap-3">
              <div className="w-9 h-9 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center shrink-0">
                <Bot className="text-slate-900 w-5 h-5" />
              </div>
              <div className="bg-slate-800/80 border border-white/5 rounded-2xl rounded-tl-sm px-5 py-3.5 flex items-center gap-1.5">
                {[0, 1, 2].map(i => (
                  <div key={i} className="w-2 h-2 bg-primary rounded-full animate-bounce"
                    style={{ animationDelay: `${i * 0.15}s` }} />
                ))}
              </div>
            </motion.div>
          )}
          <div ref={bottomRef} />
        </div>

        {/* Suggestion chips (show only at start) */}
        {messages.length === 1 && (
          <div className="px-4 pb-2 flex flex-wrap gap-2">
            {suggestions.map((s, i) => (
              <button key={i} onClick={() => handleSuggestion(s)}
                className="text-xs bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-300 hover:text-white px-3 py-1.5 rounded-full transition-all hover:border-primary/50">
                {s}
              </button>
            ))}
          </div>
        )}

        {/* Input Area */}
        <div className="p-3 md:p-4 border-t border-slate-700/50 bg-slate-900/50">
          <form onSubmit={handleSend} className="flex gap-2 items-end">
            <textarea
              ref={inputRef}
              rows={1}
              value={input}
              onChange={(e) => {
                setInput(e.target.value);
                e.target.style.height = 'auto';
                e.target.style.height = Math.min(e.target.scrollHeight, 120) + 'px';
              }}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSend(); }
              }}
              placeholder="Ask NOVA anything about your career..."
              className="flex-grow bg-slate-800 border border-slate-700 rounded-2xl px-4 py-3 text-white text-sm focus:outline-none focus:border-primary transition-colors resize-none leading-relaxed"
              disabled={loading}
            />
            <button
              type="submit"
              disabled={loading || !input.trim()}
              className="bg-gradient-to-r from-primary to-accent text-slate-900 p-3 rounded-2xl hover:opacity-90 transition-all hover:scale-105 disabled:opacity-40 disabled:scale-100 shrink-0 font-bold"
            >
              <Send className="w-5 h-5" />
            </button>
          </form>
          <p className="text-xs text-slate-600 mt-2 text-center">Press Enter to send · Shift+Enter for new line</p>
        </div>
      </GlassCard>
    </div>
  );
}
