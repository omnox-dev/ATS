import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { FileSearch, Menu, X, Sun, Moon } from 'lucide-react';

const Navbar = ({ theme, onToggleTheme }) => {
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'Resume Analyzer', path: '/analyzer' },
    { name: 'Project Info', path: '/' },
  ];

  return (
    <nav className="fixed top-0 z-50 w-full border-b border-[var(--border-subtle)] bg-[var(--bg-nav)] backdrop-blur-lg transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-20 items-center">
          {/* Logo Section */}
          <Link to="/" className="flex items-center gap-3 group">
            <div className="bg-[var(--bg-card)] p-1.5 rounded border border-[var(--border-subtle)] group-hover:opacity-80 transition-all">
              <FileSearch className="w-5 h-5 text-[#10b981]" />
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
          <div className="pt-4 pb-2 border-t border-[var(--border-subtle)]">
            <Link
              to="/analyzer"
              onClick={() => setIsOpen(false)}
              className="block w-full text-center bg-[#10b981] text-white px-4 py-3 rounded-md font-bold"
            >
              Analyze Resume
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
