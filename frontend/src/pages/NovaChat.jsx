import { useState } from 'react';
import { motion } from 'framer-motion';
import { Bot, Send, User } from 'lucide-react';
import GlassCard from '../components/GlassCard';
import axios from 'axios';

export default function NovaChat() {
  const [messages, setMessages] = useState([
    { role: 'nova', content: "Hi! I'm NOVA, your personal AI career mentor. How can I help you today?" }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSend = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMsg = input.trim();
    setMessages(prev => [...prev, { role: 'user', content: userMsg }]);
    setInput('');
    setLoading(true);

    try {
      const res = await axios.post('http://localhost:5000/api/ai/chat', { message: userMsg });
      setMessages(prev => [...prev, { role: 'nova', content: res.data.reply }]);
    } catch (error) {
      console.error(error);
      setMessages(prev => [...prev, { role: 'nova', content: "Oops! I'm having trouble connecting to the server. Please try again later." }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 mt-6 h-[calc(100vh-120px)] flex flex-col">
      <div className="text-center mb-6">
        <h1 className="text-3xl font-bold text-gradient">NOVA AI Assistant</h1>
        <p className="text-sm text-slate-400 mt-1">Your personal mentor for career guidance.</p>
      </div>

      <GlassCard className="flex-grow flex flex-col overflow-hidden p-0">
        <div className="flex-grow overflow-y-auto p-6 space-y-6">
          {messages.map((msg, idx) => (
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              key={idx} 
              className={`flex gap-4 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}
            >
              <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${msg.role === 'user' ? 'bg-secondary' : 'bg-primary'}`}>
                {msg.role === 'user' ? <User className="text-white w-5 h-5" /> : <Bot className="text-slate-900 w-6 h-6" />}
              </div>
              <div className={`max-w-[75%] rounded-2xl p-4 ${msg.role === 'user' ? 'bg-secondary/20 rounded-tr-sm' : 'bg-slate-800 rounded-tl-sm'}`}>
                <p className="text-slate-200">{msg.content}</p>
              </div>
            </motion.div>
          ))}
          {loading && (
            <div className="flex gap-4">
              <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center shrink-0">
                <Bot className="text-slate-900 w-6 h-6" />
              </div>
              <div className="bg-slate-800 rounded-2xl rounded-tl-sm p-4 flex items-center gap-2">
                <div className="w-2 h-2 bg-primary rounded-full animate-bounce"></div>
                <div className="w-2 h-2 bg-primary rounded-full animate-bounce delay-75"></div>
                <div className="w-2 h-2 bg-primary rounded-full animate-bounce delay-150"></div>
              </div>
            </div>
          )}
        </div>
        
        <div className="p-4 border-t border-slate-700/50 bg-slate-900/50">
          <form onSubmit={handleSend} className="flex gap-2">
            <input 
              type="text" 
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask NOVA anything about your career..." 
              className="flex-grow bg-slate-800 border border-slate-700 rounded-full px-6 py-3 text-white focus:outline-none focus:border-primary transition-colors"
            />
            <button 
              type="submit"
              disabled={loading}
              className="bg-primary text-slate-900 p-3 rounded-full hover:bg-primary/90 transition-transform hover:scale-105"
            >
              <Send className="w-5 h-5" />
            </button>
          </form>
        </div>
      </GlassCard>
    </div>
  );
}
