import { Link } from 'react-router-dom';
import { Rocket } from 'lucide-react';

export default function Navbar() {
  return (
    <nav className="sticky top-0 z-50 glass-panel py-4 px-6 md:px-12 flex justify-between items-center">
      <Link to="/" className="flex items-center gap-2">
        <Rocket className="text-primary w-8 h-8" />
        <span className="text-2xl font-bold text-gradient">SkillNova</span>
      </Link>
      <div className="hidden md:flex gap-6 items-center font-medium">
        <Link to="/dashboard" className="hover:text-primary transition-colors">Dashboard</Link>
        <Link to="/analyzer" className="hover:text-primary transition-colors">Skill Analyzer</Link>
        <Link to="/explorer" className="hover:text-primary transition-colors">Career Explorer</Link>
        <Link to="/nova" className="hover:text-primary transition-colors">NOVA AI</Link>
      </div>
      <Link to="/analyzer" className="bg-primary/20 hover:bg-primary/40 text-primary border border-primary/50 px-5 py-2 rounded-full font-semibold transition-all">
        Get Started
      </Link>
    </nav>
  );
}
