import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowRight, BrainCircuit, Compass, Target } from 'lucide-react';
import GlassCard from '../components/GlassCard';

export default function LandingPage() {
  return (
    <div className="relative overflow-hidden min-h-[calc(100vh-80px)] flex flex-col justify-center items-center text-center px-4">
      {/* Background Orbs */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/20 rounded-full blur-[120px] -z-10"></div>
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-secondary/20 rounded-full blur-[120px] -z-10"></div>

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="max-w-4xl mx-auto"
      >
        <h1 className="text-5xl md:text-7xl font-extrabold mb-6 tracking-tight">
          Discover Your Skills. <br />
          <span className="text-gradient">Build Your Future.</span>
        </h1>
        <p className="text-lg md:text-xl text-slate-300 mb-10 max-w-2xl mx-auto">
          SkillNova is an AI career guidance platform that helps you discover your strengths, analyze your path, and improve yourself with personalized AI guidance.
        </p>

        <Link 
          to="/analyzer" 
          className="inline-flex items-center gap-2 bg-gradient-to-r from-primary to-secondary hover:from-primary/80 hover:to-secondary/80 text-white px-8 py-4 rounded-full text-lg font-bold transition-all shadow-[0_0_30px_rgba(56,189,248,0.5)] hover:scale-105"
        >
          Start Skill Analysis <ArrowRight className="w-5 h-5" />
        </Link>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-24 max-w-6xl mx-auto w-full">
        <GlassCard className="text-left">
          <BrainCircuit className="w-10 h-10 text-primary mb-4" />
          <h3 className="text-xl font-bold mb-2">AI Skill Analyzer</h3>
          <p className="text-slate-400">Discover your strengths and get missing skills mapped out for your desired career.</p>
        </GlassCard>
        
        <GlassCard className="text-left">
          <Compass className="w-10 h-10 text-secondary mb-4" />
          <h3 className="text-xl font-bold mb-2">Career Explorer</h3>
          <p className="text-slate-400">Explore salaries, roadmaps, and requirements for Data Science, AI, Web Dev, and more.</p>
        </GlassCard>

        <GlassCard className="text-left">
          <Target className="w-10 h-10 text-accent mb-4" />
          <h3 className="text-xl font-bold mb-2">Personalized Roadmap</h3>
          <p className="text-slate-400">Get a step-by-step path from beginner to advanced with course & project recommendations.</p>
        </GlassCard>
      </div>
    </div>
  );
}
