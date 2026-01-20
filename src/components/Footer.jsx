import React from 'react';
import { Link } from 'react-router-dom';
import { FileSearch } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="border-t border-[var(--border-subtle)] py-16 bg-[var(--bg-main)] transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-12 mb-16">
          <div className="col-span-2">
            <div className="flex items-center gap-3 mb-6">
              <div className="bg-[var(--bg-nav)] p-1.5 rounded border border-[var(--border-subtle)]">
                <FileSearch className="text-[#10b981] w-5 h-5 block" />
              </div>
              <span className="font-display font-black text-lg tracking-tight text-[var(--text-main)] uppercase flex items-center gap-2">
                ATS<span className="text-[#10b981]">MASTER</span> 
                <span className="text-[10px] text-[var(--text-muted)] font-mono tracking-normal leading-none uppercase transition-colors duration-300">Student Edition</span>
              </span>
            </div>
            <p className="text-[var(--text-muted)] max-w-xs text-sm leading-relaxed font-sans font-medium transition-colors duration-300">
              A peer-to-peer student resource focusing on resume structural integrity and cross-platform keyword mapping. Designed for local privacy.
            </p>
          </div>
          <div>
            <h4 className="font-display font-black mb-6 text-[var(--text-main)] text-[10px] uppercase tracking-widest transition-colors duration-300">Navigation</h4>
            <ul className="space-y-4 text-xs text-[var(--text-muted)] font-bold uppercase tracking-widest transition-colors duration-300">
              <li><Link to="/" className="hover:text-[#10b981] transition-colors">Home</Link></li>
              <li><Link to="/analyzer" className="hover:text-[#10b981] transition-colors">Analyzer</Link></li>
              <li><a className="hover:text-[#10b981] transition-colors" href="https://github.com/omnox-dev/ATS">Source</a></li>
            </ul>
          </div>
          <div>
            <h4 className="font-display font-black mb-6 text-[var(--text-main)] text-[10px] uppercase tracking-widest transition-colors duration-300">Project</h4>
            <ul className="space-y-4 text-xs text-[var(--text-muted)] font-bold uppercase tracking-widest transition-colors duration-300">
              <li><a className="hover:text-[#10b981] transition-colors" href="#">Support</a></li>
              <li><a className="hover:text-[#10b981] transition-colors" href="#">Manifesto</a></li>
            </ul>
          </div>
          <div>
            <h4 className="font-display font-black mb-6 text-[var(--text-main)] text-[10px] uppercase tracking-widest transition-colors duration-300">System</h4>
            <ul className="space-y-4 text-xs text-[var(--text-muted)] font-bold uppercase tracking-widest transition-colors duration-300">
              <li><span className="hover:text-[#10b981] transition-colors transition-colors duration-300">Client-Side</span></li>
              <li><span className="hover:text-[#10b981] transition-colors transition-colors duration-300">Open-Source</span></li>
            </ul>
          </div>
        </div>
        <div className="pt-8 border-t border-[var(--border-subtle)] flex flex-col md:flex-row justify-between items-center gap-4 text-[10px] text-[var(--text-muted)] font-black uppercase tracking-widest transition-colors duration-300">
          <p>© 2026 ATSMASTER. By Students for Students.</p>
          <div className="flex gap-8 transition-colors duration-300">
            <a className="hover:text-[var(--text-main)] transition-colors" href="https://github.com/omnox-dev">Developer Hub</a>
            <span className="text-[var(--border-subtle)] transition-colors duration-300">|</span>
            <span className="italic normal-case tracking-normal transition-colors duration-300">Not an employment agency.</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
