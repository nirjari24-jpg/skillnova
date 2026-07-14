import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, Loader2, CheckCircle, XCircle, Lightbulb, Trophy, Target, ChevronRight } from 'lucide-react';
import GlassCard from '../components/GlassCard';
import axios from 'axios';

function ScoreRing({ score }) {
  const radius = 54;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (score / 100) * circumference;
  const color = score >= 70 ? '#34d399' : score >= 45 ? '#38bdf8' : '#f87171';

  return (
    <div className="relative w-40 h-40 mx-auto">
      <svg className="w-full h-full -rotate-90" viewBox="0 0 128 128">
        <circle cx="64" cy="64" r={radius} fill="none" stroke="#1e293b" strokeWidth="12" />
        <circle cx="64" cy="64" r={radius} fill="none" stroke={color} strokeWidth="12"
          strokeDasharray={circumference} strokeDashoffset={offset}
          strokeLinecap="round" className="transition-all duration-1000" />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-4xl font-extrabold text-white">{score}</span>
        <span className="text-slate-400 text-sm">/100</span>
      </div>
    </div>
  );
}

export default function SkillAnalyzer() {
  const [profile, setProfile] = useState('');
  const [skills, setSkills] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);

  const handleAnalyze = async (e) => {
    e.preventDefault();
    setLoading(true);
    setResult(null);
    try {
      const res = await axios.post('http://localhost:5000/api/ai/analyze', { profile, skills });
      setResult(res.data);
    } catch (error) {
      console.error(error);
      alert('Failed to analyze skills. Make sure the backend server is running on port 5000.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto p-6 mt-8">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <div className="text-center mb-10">
          <h1 className="text-4xl font-bold text-gradient mb-3">AI Skill Analyzer</h1>
          <p className="text-slate-300">Tell NOVA about your background and skills — get a personalized AI-powered analysis.</p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 items-start">
          {/* Input Form */}
          <GlassCard>
            <h2 className="text-lg font-bold mb-5 flex items-center gap-2">
              <Target className="w-5 h-5 text-primary" /> Your Profile
            </h2>
            <form onSubmit={handleAnalyze} className="flex flex-col gap-4">
              <div>
                <label className="block text-sm font-medium mb-2 text-slate-300">Background / Education</label>
                <textarea
                  className="w-full bg-slate-900/50 border border-slate-700 rounded-xl p-3 text-white text-sm focus:border-primary focus:ring-1 focus:ring-primary/30 outline-none transition-all"
                  rows="4"
                  placeholder="e.g., Final year Computer Science student at XYZ University. Completed internship in web development..."
                  value={profile}
                  onChange={(e) => setProfile(e.target.value)}
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2 text-slate-300">Current Skills</label>
                <textarea
                  className="w-full bg-slate-900/50 border border-slate-700 rounded-xl p-3 text-white text-sm focus:border-primary focus:ring-1 focus:ring-primary/30 outline-none transition-all"
                  rows="4"
                  placeholder="e.g., Python (intermediate), basic HTML/CSS, JavaScript, good communication skills, problem-solving..."
                  value={skills}
                  onChange={(e) => setSkills(e.target.value)}
                  required
                />
              </div>
              <button
                type="submit"
                disabled={loading}
                className="bg-gradient-to-r from-primary to-accent text-slate-900 font-bold py-3 rounded-xl flex justify-center items-center gap-2 hover:opacity-90 transition-all hover:scale-[1.02] disabled:opacity-60 disabled:scale-100 mt-1"
              >
                {loading
                  ? <><Loader2 className="animate-spin w-5 h-5" /> Analyzing with AI...</>
                  : <><Send className="w-4 h-4" /> Analyze My Skills</>
                }
              </button>
            </form>
          </GlassCard>

          {/* Results */}
          <AnimatePresence mode="wait">
            {result ? (
              <motion.div key="result" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0 }}
                className="space-y-4">
                {/* Score Card */}
                <GlassCard className="text-center border-primary/20">
                  <h2 className="text-lg font-bold mb-4 flex items-center justify-center gap-2">
                    <Trophy className="w-5 h-5 text-yellow-400" /> Skill Score
                  </h2>
                  <ScoreRing score={result.score} />
                  <p className="mt-3 text-sm text-slate-400">
                    {result.score >= 70 ? '🔥 Great foundation! Keep building.' :
                      result.score >= 45 ? '📈 Good start — focus on the gaps.' :
                        '💡 Early stage — clear path ahead.'}
                  </p>
                </GlassCard>

                {/* Strengths */}
                <GlassCard className="border-emerald-500/20">
                  <h3 className="font-bold text-emerald-400 mb-3 flex items-center gap-2">
                    <CheckCircle className="w-4 h-4" /> Your Strengths
                  </h3>
                  <ul className="space-y-2">
                    {result.strengths?.map((s, i) => (
                      <li key={i} className="flex items-start gap-2 text-sm text-slate-300">
                        <ChevronRight className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />{s}
                      </li>
                    ))}
                  </ul>
                </GlassCard>

                {/* Weaknesses */}
                <GlassCard className="border-rose-500/20">
                  <h3 className="font-bold text-rose-400 mb-3 flex items-center gap-2">
                    <XCircle className="w-4 h-4" /> Areas to Improve
                  </h3>
                  <ul className="space-y-2">
                    {result.weaknesses?.map((w, i) => (
                      <li key={i} className="flex items-start gap-2 text-sm text-slate-300">
                        <ChevronRight className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />{w}
                      </li>
                    ))}
                  </ul>
                </GlassCard>

                {/* Suggestions */}
                <GlassCard className="border-primary/20">
                  <h3 className="font-bold text-primary mb-3 flex items-center gap-2">
                    <Lightbulb className="w-4 h-4" /> Action Plan
                  </h3>
                  <ul className="space-y-2">
                    {result.suggestions?.map((s, i) => (
                      <li key={i} className="flex items-start gap-2 text-sm text-slate-300">
                        <span className="text-primary font-bold shrink-0">{i + 1}.</span>{s}
                      </li>
                    ))}
                  </ul>
                </GlassCard>
              </motion.div>
            ) : (
              <motion.div key="placeholder" initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                className="glass-card rounded-2xl flex flex-col items-center justify-center h-64 text-center border-dashed border-2 border-slate-700">
                <Target className="w-12 h-12 text-slate-600 mb-3" />
                <p className="text-slate-500 text-sm">Your analysis results will appear here</p>
                <p className="text-slate-600 text-xs mt-1">Fill in the form and click Analyze</p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </div>
  );
}
