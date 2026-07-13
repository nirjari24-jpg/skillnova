import { useState } from 'react';
import { motion } from 'framer-motion';
import { Send, Loader2 } from 'lucide-react';
import GlassCard from '../components/GlassCard';
import axios from 'axios';

export default function SkillAnalyzer() {
  const [profile, setProfile] = useState('');
  const [skills, setSkills] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);

  const handleAnalyze = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await axios.post('http://localhost:5000/api/ai/analyze', { profile, skills });
      setResult(res.data);
    } catch (error) {
      console.error(error);
      alert('Failed to analyze skills. Is the backend running?');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 mt-10">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-4xl font-bold text-gradient mb-6 text-center">AI Skill Analyzer</h1>
        <p className="text-center text-slate-300 mb-10">Enter your current background and skills to get a personalized analysis.</p>

        <div className="grid md:grid-cols-2 gap-8">
          <GlassCard>
            <form onSubmit={handleAnalyze} className="flex flex-col gap-4">
              <div>
                <label className="block text-sm font-medium mb-2 text-slate-300">Background/Education</label>
                <textarea 
                  className="w-full bg-slate-900/50 border border-slate-700 rounded-lg p-3 text-white focus:border-primary outline-none"
                  rows="3"
                  placeholder="e.g., Final year Computer Science student..."
                  value={profile}
                  onChange={(e) => setProfile(e.target.value)}
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2 text-slate-300">Current Skills</label>
                <textarea 
                  className="w-full bg-slate-900/50 border border-slate-700 rounded-lg p-3 text-white focus:border-primary outline-none"
                  rows="3"
                  placeholder="e.g., Python, basic HTML/CSS, communication..."
                  value={skills}
                  onChange={(e) => setSkills(e.target.value)}
                  required
                />
              </div>
              <button 
                type="submit" 
                disabled={loading}
                className="bg-primary text-slate-900 font-bold py-3 rounded-lg flex justify-center items-center gap-2 hover:bg-primary/90 transition-colors mt-2"
              >
                {loading ? <Loader2 className="animate-spin w-5 h-5" /> : <Send className="w-5 h-5" />}
                Analyze My Skills
              </button>
            </form>
          </GlassCard>

          {result && (
            <GlassCard className="border-primary/30">
              <h2 className="text-2xl font-bold mb-4">Analysis Result</h2>
              <div className="mb-4">
                <span className="text-sm text-slate-400">Skill Score</span>
                <div className="text-4xl font-bold text-gradient">{result.score}/100</div>
              </div>
              
              <div className="mb-4">
                <h3 className="font-bold text-emerald-400 mb-2">Strengths</h3>
                <ul className="list-disc pl-5 text-sm text-slate-300">
                  {result.strengths?.map((s, i) => <li key={i}>{s}</li>)}
                </ul>
              </div>

              <div className="mb-4">
                <h3 className="font-bold text-rose-400 mb-2">Areas to Improve</h3>
                <ul className="list-disc pl-5 text-sm text-slate-300">
                  {result.weaknesses?.map((w, i) => <li key={i}>{w}</li>)}
                </ul>
              </div>

              <div>
                <h3 className="font-bold text-primary mb-2">Actionable Suggestions</h3>
                <ul className="list-disc pl-5 text-sm text-slate-300">
                  {result.suggestions?.map((s, i) => <li key={i}>{s}</li>)}
                </ul>
              </div>
            </GlassCard>
          )}
        </div>
      </motion.div>
    </div>
  );
}
