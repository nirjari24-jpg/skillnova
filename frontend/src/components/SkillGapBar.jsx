import { motion } from 'framer-motion';

export default function SkillGapBar({ skillName, currentPercentage, requiredPercentage }) {
  // If current > required, cap the visual diff
  const visualCurrent = Math.min(currentPercentage, requiredPercentage);
  const diff = requiredPercentage - currentPercentage;
  const isComplete = currentPercentage >= requiredPercentage;

  return (
    <div className="mb-4">
      <div className="flex justify-between items-end mb-1">
        <span className="font-medium text-slate-200">{skillName}</span>
        <span className="text-xs text-slate-400">
          {isComplete ? (
            <span className="text-emerald-400">Ready</span>
          ) : (
            <span>Need {diff}% more</span>
          )}
        </span>
      </div>
      
      <div className="h-3 w-full bg-slate-800 rounded-full overflow-hidden flex relative">
        {/* The required background marker */}
        <div 
          className="absolute top-0 bottom-0 right-0 border-l-2 border-white/20 z-20"
          style={{ width: `${100 - requiredPercentage}%` }}
        ></div>
        
        {/* Current Skill Bar */}
        <motion.div 
          initial={{ width: 0 }}
          animate={{ width: `${currentPercentage}%` }}
          transition={{ duration: 1, delay: 0.2 }}
          className={`h-full z-10 ${isComplete ? 'bg-emerald-500' : 'bg-primary'}`}
        ></motion.div>

        {/* The Gap Bar */}
        {!isComplete && (
          <motion.div 
            initial={{ width: 0 }}
            animate={{ width: `${diff}%` }}
            transition={{ duration: 1, delay: 1.2 }}
            className="h-full bg-rose-500/50 z-0"
          ></motion.div>
        )}
      </div>
    </div>
  );
}
