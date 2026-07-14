import { motion } from 'framer-motion';
import { Briefcase, DollarSign, ChevronRight } from 'lucide-react';
import { cn } from '../utils/cn';

export default function CareerCard({ career, matchPercentage, onClick, className, style }) {
  return (
    <motion.div 
      style={style}
      whileHover={{ scale: 1.03, y: -5 }}
      className={cn(
        "bg-white/5 backdrop-blur-xl border border-primary/20 rounded-2xl p-6 shadow-[0_0_15px_rgba(0,242,254,0.1)] hover:shadow-[0_0_30px_rgba(0,242,254,0.3)] transition-all cursor-pointer flex flex-col h-full relative overflow-hidden group",
        className
      )}
      onClick={onClick}
    >
      {/* Glow effect on hover */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
      
      {matchPercentage && (
        <div className="absolute top-4 right-4 bg-primary/20 text-primary text-xs font-bold px-3 py-1 rounded-full border border-primary/30">
          {matchPercentage}% Match
        </div>
      )}

      <div className="bg-primary/10 p-3 rounded-xl w-fit mb-4 text-primary relative z-10 group-hover:bg-primary/20 transition-colors">
        <Briefcase className="w-6 h-6" />
      </div>
      
      <h3 className="text-2xl font-bold mb-1 relative z-10 text-white group-hover:text-primary transition-colors">{career.title}</h3>
      <p className="text-slate-400 text-sm mb-4 relative z-10">{career.category}</p>
      
      <p className="text-slate-300 text-sm mb-6 line-clamp-2 relative z-10">{career.overview}</p>
      
      <div className="mt-auto pt-4 border-t border-slate-700/50 flex items-center justify-between relative z-10">
        <div className="flex items-center gap-1 text-emerald-400 font-medium text-sm">
          <DollarSign className="w-4 h-4" />
          {career.salaryRange}
        </div>
        <div className="text-primary text-sm font-semibold flex items-center gap-1 group-hover:gap-2 transition-all">
          Explore <ChevronRight className="w-4 h-4" />
        </div>
      </div>
    </motion.div>
  );
}
