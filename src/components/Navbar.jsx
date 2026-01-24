import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, Sun, Moon, Zap, Clock } from 'lucide-react';
import axios from 'axios';

const Navbar = ({ theme, onToggleTheme }) => {
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);
  const [hiringEnabled, setHiringEnabled] = useState(true);
  const [isOccupied, setIsOccupied] = useState(false);
  const [announcement, setAnnouncement] = useState('');
  const [serviceFee, setServiceFee] = useState(69);

  useEffect(() => {
    const checkHiring = async () => {
      try {
        const resp = await axios.get('/api/config');
        setHiringEnabled(resp.data.hiringEnabled !== false);
        setIsOccupied(resp.data.occupiedMode === true);
        setAnnouncement(resp.data.announcement || '');
        setServiceFee(resp.data.serviceFee || 69);
      } catch (e) {
        // Fallback to enabled
      }
    };
    checkHiring();
  }, [location.pathname]); // Re-check on navigation

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'Resume Analyzer', path: '/analyzer' },
    { name: 'Project Info', path: '/project-info' },
  ];

  return (
    <>
      {announcement && (
        <div className="fixed top-0 z-[60] w-full bg-[#10b981] text-white py-2 text-center text-[10px] font-black uppercase tracking-[0.2em] shadow-lg">
          <span className="inline-block animate-pulse mr-2">●</span> {announcement}
        </div>
      )}
      <nav className={`fixed ${announcement ? 'top-8' : 'top-0'} z-50 w-full border-b border-[var(--border-subtle)] bg-[var(--bg-nav)] backdrop-blur-lg transition-all duration-300 shadow-sm`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-20 items-center">
          {/* Logo Section */}
          <Link to="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 rounded border border-[var(--border-subtle)] overflow-hidden group-hover:opacity-80 transition-all flex items-center justify-center bg-[var(--bg-card)]">
              <img 
                src={theme === 'dark' ? '/night.png' : '/day.png'} 
                alt="Logo" 
                className="w-full h-full object-cover"
              />
            </div>
            <span className="font-display text-xl font-black tracking-tight text-[var(--text-main)] uppercase flex items-center">
              ATS<span className="text-[#10b981]">MASTER</span> 
              <span className="text-[10px] bg-[var(--bg-card)] px-2 py-0.5 rounded border border-[var(--border-subtle)] ml-2 font-mono text-[var(--text-muted)] normal-case hidden sm:block">
                STUDENT
              </span>
            </span>
          </Link>

          {/* Desktop Nav Links */}
          <div className="hidden md:flex items-center gap-8 text-sm font-semibold tracking-wide">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                to={link.path}
                className={`transition-colors ${
                  location.pathname === link.path
                    ? 'text-[#10b981]'
                    : 'text-[var(--text-muted)] hover:text-[var(--text-main)]'
                }`}
              >
                {link.name}
              </Link>
            ))}
          </div>

          {/* Desktop CTA & Theme Toggle */}
          <div className="hidden md:flex items-center gap-6">
            <button 
              onClick={onToggleTheme}
              className="p-2.5 rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-card)] text-[var(--text-muted)] hover:text-[var(--text-main)] transition-all"
              aria-label="Toggle Theme"
            >
              {theme === 'dark' ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </button>
            <Link 
              to="/analyzer" 
              className="bg-[#10b981] hover:bg-emerald-600 text-white px-6 py-2.5 rounded-xl font-bold text-sm transition-all shadow-lg"
            >
              Analyze Resume
            </Link>
            {hiringEnabled && (
              <button 
                onClick={() => {
                  const msg = isOccupied 
                    ? `Hi Omnox! I'd like to join the waitlist for your Structural LaTeX Typesetting service (₹${serviceFee}).` 
                    : `Hi Omnox! I'm interested in the ₹${serviceFee} Professional LaTeX Typesetting service. Can you help me?`;
                  window.open(`https://wa.me/919022826027?text=${encodeURIComponent(msg)}`, '_blank');
                }}
                className={`flex items-center gap-2 ${isOccupied ? 'bg-amber-600 hover:bg-amber-500' : 'bg-purple-600 hover:bg-purple-500'} text-white px-6 py-2.5 rounded-xl font-bold text-sm transition-all shadow-lg animate-pulse hover:animate-none`}
              >
                {isOccupied ? <Clock className="w-4 h-4" /> : <Zap className="w-4 h-4 fill-current" />}
                {isOccupied ? 'Join Waitlist' : 'Hire Me'}
              </button>
            )}
          </div>

          {/* Mobile Menu Button & Toggle */}
          <div className="md:hidden flex items-center gap-4">
            <button 
              onClick={onToggleTheme}
              className="p-2 rounded-lg border border-[var(--border-subtle)] bg-[var(--bg-card)] text-[var(--text-muted)]"
            >
              {theme === 'dark' ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </button>
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="p-2 rounded-md text-[var(--text-muted)] hover:text-[var(--text-main)]"
            >
              {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden bg-[var(--bg-main)] border-b border-[var(--border-subtle)] px-2 pt-2 pb-3 space-y-1 sm:px-3 animate-in slide-in-from-top duration-200">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              to={link.path}
              onClick={() => setIsOpen(false)}
              className={`block px-3 py-2 rounded-md text-base font-medium ${
                location.pathname === link.path
                  ? 'text-[#10b981]'
                  : 'text-[var(--text-muted)] hover:text-[var(--text-main)] hover:bg-[var(--bg-card)]'
              }`}
            >
              {link.name}
            </Link>
          ))}
          <div className="pt-4 pb-2 border-t border-[var(--border-subtle)] space-y-3">
            <Link
              to="/analyzer"
              onClick={() => setIsOpen(false)}
              className="block w-full text-center bg-[#10b981] text-white px-4 py-3 rounded-md font-bold"
            >
              Analyze Resume
            </Link>
            {hiringEnabled && (
                <button
                  onClick={() => {
                    const msg = isOccupied 
                      ? `Hi Omnox! I'd like to join the waitlist for your Structural LaTeX Typesetting service (₹${serviceFee}).` 
                      : `Hi Omnox! I'm interested in the ₹${serviceFee} Professional LaTeX Typesetting service. Can you help me?`;
                    window.open(`https://wa.me/919022826027?text=${encodeURIComponent(msg)}`, '_blank');
                    setIsOpen(false);
                  }}
                  className={`flex items-center justify-center gap-2 w-full text-center ${isOccupied ? 'bg-amber-600' : 'bg-purple-600'} text-white px-4 py-3 rounded-md font-bold`}
                >
                  {isOccupied ? <Clock className="w-4 h-4" /> : <Zap className="w-4 h-4 fill-current" />}
                  {isOccupied ? 'Join Waitlist' : 'Professional Hire'}
                </button>
            )}
          </div>
        </div>
      )}

      </nav>
    </>
  );
};

export default Navbar;
