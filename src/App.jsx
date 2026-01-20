import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LandingPage from './components/LandingPage';
import ATSAnalyzer from './components/ATSAnalyzer';
import Navbar from './components/Navbar';
import Footer from './components/Footer';

function App() {
  const [theme, setTheme] = useState(localStorage.getItem('app-theme') || 'dark');

  const toggleTheme = () => {
    const newTheme = theme === 'dark' ? 'light' : 'dark';
    setTheme(newTheme);
    localStorage.setItem('app-theme', newTheme);
  };

  useEffect(() => {
    document.body.className = theme === 'light' ? 'light-theme' : '';
  }, [theme]);

  return (
    <Router>
      <div className={`min-h-screen flex flex-col transition-colors duration-300`}>
        <Navbar theme={theme} onToggleTheme={toggleTheme} />
        <main className="flex-grow">
          <Routes>
            <Route path="/" element={<LandingPage theme={theme} />} />
            <Route path="/analyzer" element={<ATSAnalyzer theme={theme} />} />
          </Routes>
        </main>
        <Footer theme={theme} />
      </div>
    </Router>
  );
}

export default App;


