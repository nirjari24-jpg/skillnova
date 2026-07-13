import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Briefcase, DollarSign } from 'lucide-react';
import GlassCard from '../components/GlassCard';
import axios from 'axios';

export default function CareerExplorer() {
  const [careers, setCareers] = useState([]);

  useEffect(() => {
    // Fetch from backend
    axios.get('http://localhost:5000/api/careers')
      .then(res => setCareers(res.data))
      .catch(err => console.error(err));
  }, []);

  return (
    <div className="max-w-6xl mx-auto p-6 mt-10">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-4xl font-bold text-gradient mb-4 text-center">Career Explorer</h1>
        <p className="text-center text-slate-300 mb-12">Discover pathways, average salaries, and required skills for top tech roles.</p>

        <div className="grid md:grid-cols-3 gap-6">
          {careers.map((career) => (
            <GlassCard key={career.id} className="flex flex-col h-full hover:-translate-y-2 transition-transform">
              <div className="bg-primary/20 p-3 rounded-xl w-fit mb-4 text-primary">
                <Briefcase className="w-6 h-6" />
              </div>
              <h3 className="text-2xl font-bold mb-2">{career.title}</h3>
              <p className="text-slate-400 text-sm mb-4">{career.category}</p>
              
              <div className="mt-auto pt-4 border-t border-slate-700/50 flex items-center justify-between">
                <div className="flex items-center gap-1 text-emerald-400 font-medium">
                  <DollarSign className="w-4 h-4" />
                  {career.salaryRange}
                </div>
                <button className="text-primary text-sm font-semibold hover:underline">View Roadmap</button>
              </div>
            </GlassCard>
          ))}
          {careers.length === 0 && (
            <div className="col-span-3 text-center text-slate-400 py-12">
              Loading careers... (Make sure backend is running)
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
}
