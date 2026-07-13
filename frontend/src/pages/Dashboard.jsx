import { motion } from 'framer-motion';
import GlassCard from '../components/GlassCard';

export default function Dashboard() {
  return (
    <div className="max-w-6xl mx-auto p-6 mt-10">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-4xl font-bold text-gradient mb-8">Your Dashboard</h1>
        
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <GlassCard>
            <h3 className="text-slate-400 font-medium mb-1">Overall Skill Score</h3>
            <div className="text-5xl font-bold text-primary">75<span className="text-2xl text-slate-500">/100</span></div>
          </GlassCard>
          <GlassCard>
            <h3 className="text-slate-400 font-medium mb-1">Target Career</h3>
            <div className="text-2xl font-bold text-white mt-2">AI Engineer</div>
            <p className="text-sm text-secondary mt-1">On Track</p>
          </GlassCard>
          <GlassCard>
            <h3 className="text-slate-400 font-medium mb-1">Roadmap Progress</h3>
            <div className="w-full bg-slate-800 rounded-full h-4 mt-4 overflow-hidden">
              <div className="bg-gradient-to-r from-primary to-accent h-4 rounded-full" style={{ width: '45%' }}></div>
            </div>
            <p className="text-right text-sm text-slate-400 mt-2">45% Completed</p>
          </GlassCard>
        </div>

        <h2 className="text-2xl font-bold mb-4">Recommended Next Steps</h2>
        <div className="space-y-4">
          <GlassCard className="flex items-center justify-between !p-4 border-l-4 border-l-primary">
            <div>
              <h4 className="font-bold text-white">Complete Python Advanced Course</h4>
              <p className="text-sm text-slate-400">Estimated time: 3 hours</p>
            </div>
            <button className="bg-slate-800 hover:bg-slate-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors">Start</button>
          </GlassCard>
          <GlassCard className="flex items-center justify-between !p-4 border-l-4 border-l-secondary">
            <div>
              <h4 className="font-bold text-white">Practice Machine Learning Models</h4>
              <p className="text-sm text-slate-400">Project-based learning</p>
            </div>
            <button className="bg-slate-800 hover:bg-slate-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors">Start</button>
          </GlassCard>
        </div>
      </motion.div>
    </div>
  );
}
