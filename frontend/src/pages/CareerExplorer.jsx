import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, X, Target, BookOpen } from 'lucide-react';
import axios from 'axios';
import GlassCard from '../components/GlassCard';
import CareerCard from '../components/CareerCard';
import SkillGapBar from '../components/SkillGapBar';

export default function CareerExplorer() {
  const [careers, setCareers] = useState([]);
  const [aiLoading, setAiLoading] = useState(false);
  const [showAiForm, setShowAiForm] = useState(false);
  const [aiProfile, setAiProfile] = useState('');
  const [aiSkills, setAiSkills] = useState('');
  const [recommendations, setRecommendations] = useState(null);

  useEffect(() => {
    axios.get('http://localhost:5000/api/careers')
      .then(res => setCareers(res.data))
      .catch(err => console.error(err));
  }, []);

  const handleDiscover = async (e) => {
    e.preventDefault();
    setAiLoading(true);
    try {
      const res = await axios.post('http://localhost:5000/api/ai/discover', { profile: aiProfile, skills: aiSkills });
      setRecommendations(res.data.matches);
      setShowAiForm(false);
    } catch (error) {
      console.error(error);
      alert('Failed to get AI recommendations. Ensure backend is running.');
    } finally {
      setAiLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen pb-20">
      {/* Galaxy Background Elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none -z-10">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary/20 rounded-full blur-[150px]"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[30%] h-[30%] bg-accent/20 rounded-full blur-[120px]"></div>
        <div className="absolute top-[40%] left-[60%] w-[20%] h-[20%] bg-secondary/10 rounded-full blur-[100px] animate-pulse-slow"></div>
      </div>

      <div className="max-w-7xl mx-auto p-6 mt-10">
        {/* HERO SECTION */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }} 
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-16 relative"
        >
          <h1 className="text-5xl md:text-6xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-primary via-white to-secondary mb-4 drop-shadow-[0_0_15px_rgba(0,242,254,0.3)]">
            Career Explorer
          </h1>
          <p className="text-xl text-slate-300 mb-8 max-w-2xl mx-auto">
            Explore your future in the universe of possibilities
          </p>

          <button 
            onClick={() => setShowAiForm(!showAiForm)}
            className="inline-flex items-center gap-2 bg-gradient-to-r from-primary to-accent text-white px-8 py-4 rounded-full font-bold shadow-[0_0_20px_rgba(155,81,224,0.4)] hover:shadow-[0_0_40px_rgba(155,81,224,0.6)] transition-all hover:-translate-y-1"
          >
            <Sparkles className="w-5 h-5" />
            AI Skill Analysis
          </button>
        </motion.div>

        {/* AI FORM MODAL */}
        <AnimatePresence>
          {showAiForm && (
            <motion.div 
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="mb-16 overflow-hidden max-w-3xl mx-auto"
            >
              <GlassCard className="relative border-accent/30">
                <button onClick={() => setShowAiForm(false)} className="absolute top-4 right-4 text-slate-400 hover:text-white">
                  <X className="w-5 h-5" />
                </button>
                <h2 className="text-2xl font-bold mb-4 text-white">Find Your Path</h2>
                <form onSubmit={handleDiscover} className="space-y-4">
                  <div>
                    <label className="block text-sm text-slate-300 mb-1">Education & Background</label>
                    <textarea 
                      required
                      value={aiProfile}
                      onChange={e => setAiProfile(e.target.value)}
                      className="w-full bg-slate-900/50 border border-slate-700 rounded-lg p-3 text-white focus:border-accent outline-none"
                      placeholder="e.g. 3rd year CS Student interested in data analysis..."
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-slate-300 mb-1">Current Skills</label>
                    <textarea 
                      required
                      value={aiSkills}
                      onChange={e => setAiSkills(e.target.value)}
                      className="w-full bg-slate-900/50 border border-slate-700 rounded-lg p-3 text-white focus:border-accent outline-none"
                      placeholder="e.g. Python, basic SQL, Mathematics..."
                    />
                  </div>
                  <button type="submit" disabled={aiLoading} className="w-full bg-white/10 hover:bg-white/20 border border-accent/50 text-white font-bold py-3 rounded-lg transition-colors">
                    {aiLoading ? "Analyzing Universe..." : "Discover Careers"}
                  </button>
                </form>
              </GlassCard>
            </motion.div>
          )}
        </AnimatePresence>

        {/* AI RECOMMENDATIONS & SKILL GAP */}
        {recommendations && (
          <motion.div 
            initial={{ opacity: 0 }} animate={{ opacity: 1 }}
            className="mb-20"
          >
            <div className="flex items-center gap-2 mb-6">
              <Target className="text-accent w-6 h-6" />
              <h2 className="text-3xl font-bold text-white">Recommended For You</h2>
            </div>
            
            <div className="grid md:grid-cols-2 gap-8">
              {recommendations.map((rec, idx) => {
                const careerData = careers.find(c => c.id === rec.careerId);
                return (
                  <GlassCard key={idx} className="border-accent/30 flex flex-col">
                    <div className="flex justify-between items-start mb-4">
                      <h3 className="text-2xl font-bold text-white">{rec.title}</h3>
                      <div className="bg-accent/20 text-accent font-bold px-3 py-1 rounded-full text-sm border border-accent/30">
                        {rec.matchPercentage}% Match
                      </div>
                    </div>
                    
                    <p className="text-slate-300 mb-4">{rec.why}</p>
                    
                    <div className="mb-4">
                      <h4 className="text-sm font-bold text-primary mb-2">Missing Skills</h4>
                      <div className="flex flex-wrap gap-2">
                        {rec.missingSkills.map((ms, i) => (
                          <span key={i} className="bg-rose-500/10 text-rose-300 text-xs px-2 py-1 rounded border border-rose-500/20">{ms}</span>
                        ))}
                      </div>
                    </div>
                    
                    <div className="mt-auto pt-4 border-t border-slate-700/50 mb-6">
                      <p className="text-sm text-slate-400"><span className="font-bold text-white">Next Step:</span> {rec.nextSteps}</p>
                    </div>

                    {/* Skill Gap For Recommendation */}
                    {careerData && careerData.requiredSkills && (
                      <div className="mt-auto bg-slate-900/40 p-4 rounded-xl border border-slate-700/50">
                        <h4 className="text-sm font-bold mb-4 text-white">Skill Gap Analysis</h4>
                        {careerData.requiredSkills.map((reqSkill, i) => (
                          <SkillGapBar 
                            key={i} 
                            skillName={reqSkill.name} 
                            requiredPercentage={reqSkill.requiredPercentage} 
                            currentPercentage={rec.missingSkills.includes(reqSkill.name) ? 30 : Math.max(reqSkill.requiredPercentage - 10, 60)} 
                          />
                        ))}
                      </div>
                    )}
                  </GlassCard>
                );
              })}
            </div>
          </motion.div>
        )}

        {/* EXPLORE ALL CAREERS (GALAXY VIEW) */}
        <div className="mb-20">
          <h2 className="text-3xl font-bold text-white mb-8">Career Galaxy</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {careers.map((career) => (
              <CareerCard 
                key={career.id} 
                career={career} 
                className="animate-float" 
                style={{ animationDelay: `${Math.random() * 2}s` }}
              />
            ))}
          </div>
        </div>

        {/* RECOMMENDED COURSES */}
        <div className="mb-20">
          <div className="flex items-center gap-2 mb-6">
            <BookOpen className="text-primary w-6 h-6" />
            <h2 className="text-3xl font-bold text-white">Recommended Courses</h2>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
             {careers.length > 0 && careers[0].recommendedCourses && careers[0].recommendedCourses.map((course, idx) => (
               <GlassCard key={idx} className="hover:-translate-y-2 transition-transform">
                 <div className="flex justify-between items-start mb-2">
                   <div className="bg-white/10 text-xs px-2 py-1 rounded text-slate-300">{course.platform}</div>
                   <div className={`text-xs px-2 py-1 rounded font-bold ${course.freePaid === 'Free' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-amber-500/20 text-amber-400'}`}>
                     {course.freePaid}
                   </div>
                 </div>
                 <h3 className="font-bold text-lg text-white mb-1">{course.name}</h3>
                 <p className="text-sm text-slate-400 mb-4">{course.level} • {course.duration}</p>
                 <button className="w-full bg-primary/20 hover:bg-primary/30 text-primary py-2 rounded font-medium transition-colors">View Course</button>
               </GlassCard>
             ))}
          </div>
        </div>

      </div>
    </div>
  );
}
