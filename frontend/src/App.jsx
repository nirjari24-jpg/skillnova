import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import LandingPage from './pages/LandingPage';
import Dashboard from './pages/Dashboard';
import SkillAnalyzer from './pages/SkillAnalyzer';
import CareerExplorer from './pages/CareerExplorer';
import NovaChat from './pages/NovaChat';

function App() {
  return (
    <Router>
      <div className="min-h-screen flex flex-col relative z-0">
        <Navbar />
        <main className="flex-grow">
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/analyzer" element={<SkillAnalyzer />} />
            <Route path="/explorer" element={<CareerExplorer />} />
            <Route path="/nova" element={<NovaChat />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
