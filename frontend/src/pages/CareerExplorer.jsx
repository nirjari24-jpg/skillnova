import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Briefcase, DollarSign, TrendingUp, Clock, ChevronDown, ChevronUp, Users, Zap } from 'lucide-react';
import GlassCard from '../components/GlassCard';
import axios from 'axios';

const demandColors = {
  'Very High': 'text-emerald-400 bg-emerald-400/10 border-emerald-400/30',
  'High': 'text-sky-400 bg-sky-400/10 border-sky-400/30',
  'Medium-High': 'text-amber-400 bg-amber-400/10 border-amber-400/30',
};

export default function CareerExplorer() {
  const [careers, setCareers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expandedId, setExpandedId] = useState(null);

  useEffect(() => {
    axios.get('http://localhost:5000/api/careers')
      .then(res => { setCareers(res.data); setLoading(false); })
      .catch(err => { console.error(err); setLoading(false); });
  }, []);

  const toggleExpand = (id) => setExpandedId(prev => prev === id ? null : id);

  return (
    <div className="max-w-6xl mx-auto p-6 mt-10">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gradient mb-4">Career Explorer</h1>
          <p className="text-slate-300 max-w-2xl mx-auto">
            Discover top tech career paths — explore salaries, required skills, demand levels, and step-by-step roadmaps.
          </p>
        </div>

        {loading ? (
          <div className="grid md:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="glass-card animate-pulse h-48 rounded-2xl bg-slate-800/50" />
            ))}
          </div>
        ) : (
          <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6">
            {careers.map((career, idx) => (
              <motion.div
                key={career.id}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.07 }}
              >
                <GlassCard className="flex flex-col h-full cursor-pointer group hover:-translate-y-1 transition-all duration-300"
                  onClick={() => toggleExpand(career.id)}>
                  {/* Card Header */}
                  <div className="flex items-start justify-between mb-3">
                    <div className="text-4xl">{career.icon}</div>
                    <span className={`text-xs font-semibold px-2 py-1 rounded-full border ${demandColors[career.demandLevel] || 'text-slate-400'}`}>
                      {career.demandLevel} Demand
                    </span>
                  </div>

                  <h3 className="text-xl font-bold mb-1 group-hover:text-primary transition-colors">{career.title}</h3>
                  <p className="text-xs text-slate-400 mb-3 font-medium uppercase tracking-wider">{career.category}</p>
                  <p className="text-slate-300 text-sm mb-4 flex-grow">{career.description}</p>

                  {/* Salary & Time */}
                  <div className="flex items-center justify-between text-sm pt-3 border-t border-slate-700/50">
                    <div className="flex items-center gap-1 text-emerald-400 font-semibold">
                      <DollarSign className="w-4 h-4" />
                      {career.salaryRange}
                    </div>
                    <div className="flex items-center gap-1 text-slate-400 text-xs">
                      <Clock className="w-3 h-3" />
                      {career.avgTime}
                    </div>
                  </div>

                  {/* Expand toggle */}
                  <button className="mt-3 flex items-center justify-center gap-1 text-xs text-primary/70 hover:text-primary transition-colors w-full pt-2 border-t border-slate-700/30">
                    {expandedId === career.id ? <><ChevronUp className="w-4 h-4" /> Hide Details</> : <><ChevronDown className="w-4 h-4" /> View Details</>}
                  </button>

                  {/* Expanded Details */}
                  <AnimatePresence>
                    {expandedId === career.id && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.3 }}
                        className="overflow-hidden"
                      >
                        <div className="mt-4 pt-4 border-t border-slate-700/50 space-y-4">
                          <div>
                            <div className="flex items-center gap-2 text-sm font-semibold text-slate-300 mb-2">
                              <Zap className="w-4 h-4 text-primary" /> Required Skills
                            </div>
                            <div className="flex flex-wrap gap-1.5">
                              {career.skillsRequired?.map((skill, i) => (
                                <span key={i} className="text-xs bg-primary/10 text-primary border border-primary/20 px-2 py-1 rounded-full">
                                  {skill}
                                </span>
                              ))}
                            </div>
                          </div>
                          <div>
                            <div className="flex items-center gap-2 text-sm font-semibold text-slate-300 mb-2">
                              <Users className="w-4 h-4 text-secondary" /> Top Hiring Companies
                            </div>
                            <div className="flex flex-wrap gap-1.5">
                              {career.topCompanies?.map((co, i) => (
                                <span key={i} className="text-xs bg-secondary/10 text-secondary border border-secondary/20 px-2 py-1 rounded-full">
                                  {co}
                                </span>
                              ))}
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </GlassCard>
              </motion.div>
            ))}
          </div>
        )}

        {!loading && careers.length === 0 && (
          <div className="text-center text-slate-400 py-20 glass-card rounded-2xl">
            <Briefcase className="w-12 h-12 mx-auto mb-4 text-slate-600" />
            <p className="text-lg">Could not load careers.</p>
            <p className="text-sm mt-2">Make sure the backend server is running on port 5000.</p>
          </div>
        )}
      </motion.div>
    </div>
  );
}
