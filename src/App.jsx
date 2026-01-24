import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import LandingPage from './components/LandingPage';
import ATSAnalyzer from './components/ATSAnalyzer';
import AdminPanel from './components/AdminPanel';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Manifesto from './components/Manifesto';
import Support from './components/Support';
import PrivacyModal from './components/PrivacyModal';
import ProjectInfo from './components/ProjectInfo';
import ScrollToTop from './components/ScrollToTop';

const AnimatedRoutes = ({ theme, toggleTheme, setIsPrivacyOpen }) => {
  const location = useLocation();
  
  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={<LandingPage theme={theme} />} />
        <Route path="/analyzer" element={<ATSAnalyzer theme={theme} />} />
        <Route path="/admin" element={<AdminPanel />} />
        <Route path="/manifesto" element={<Manifesto />} />
        <Route path="/support" element={<Support />} />
        <Route path="/project-info" element={<ProjectInfo />} />
      </Routes>
    </AnimatePresence>
  );
};

function App() {
  const [theme, setTheme] = useState(localStorage.getItem('app-theme') || 'dark');
  const [isPrivacyOpen, setIsPrivacyOpen] = useState(false);

  const toggleTheme = () => {
    const newTheme = theme === 'dark' ? 'light' : 'dark';
    setTheme(newTheme);
    localStorage.setItem('app-theme', newTheme);
  };

  useEffect(() => {
    document.body.className = theme === 'light' ? 'light-theme' : '';
    // Update Favicon
    const favicon = document.querySelector('link[rel="icon"]');
    if (favicon) {
      favicon.href = theme === 'dark' ? '/night.png' : '/day.png';
    }
  }, [theme]);

  return (
    <Router>
      <ScrollToTop />
      <div className={`min-h-screen flex flex-col transition-colors duration-300`}>
        <Navbar theme={theme} onToggleTheme={toggleTheme} />
        <main className="flex-grow">
          <AnimatedRoutes 
            theme={theme} 
            toggleTheme={toggleTheme} 
            setIsPrivacyOpen={setIsPrivacyOpen} 
          />
        </main>
        <Footer theme={theme} onOpenPrivacy={() => setIsPrivacyOpen(true)} />
        
        {/* Privacy Utility */}
        <PrivacyModal isOpen={isPrivacyOpen} onClose={() => setIsPrivacyOpen(false)} />
      </div>
    </Router>
  );
}

export default App;


