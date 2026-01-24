import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import { HelpCircle, Clock, MessageSquare, AlertTriangle, FileCode, CheckCircle2, ChevronRight, GraduationCap } from 'lucide-react';

const Support = () => {
  const [config, setConfig] = useState({ occupiedMode: false });
  const [activeTab, setActiveTab] = useState(null);

  useEffect(() => {
    const fetchConfig = async () => {
      try {
        const resp = await axios.get('/api/config');
        setConfig(resp.data);
      } catch (e) { /* ignore */ }
    };
    fetchConfig();
  }, []);

  const issues = [
    {
      id: 1,
      q: '"My PDF looks different from the Word file."',
      a: "That is a feature, not a bug. The PDF is generated using LaTeX, a typesetting system used by researchers. The Word file is just a backup. Always apply with the PDF."
    },
    {
      id: 2,
      q: '"How do I update my resume later?"',
      a: "Option A: If you have the .tex file, send it back for ₹30. Option B: If you lost the file, we start over at ₹69. Option C: Open-source mode! Download Overleaf and edit the code yourself for free."
    },
    {
      id: 3,
      q: '"I found a bug in the analyzer."',
      a: "I'm a 3rd-year engineering student, not a corporation. Ping me on GitHub. If it's a critical error, I'll fix your resume for free."
    }
  ];

  return (
    <div className="bg-[var(--bg-main)] min-h-screen pt-24 sm:pt-32 pb-20 px-4 sm:px-6 font-sans">
      <div className="max-w-4xl mx-auto space-y-12 sm:space-y-16">
        
        {/* Header & Status */}
        <div className="flex flex-col lg:flex-row justify-between items-start gap-8">
          <div className="space-y-4">
            <h1 className="text-3xl sm:text-5xl font-black text-[var(--text-main)] uppercase tracking-tighter">Debugging & <span className="text-[#10b981]">Support</span></h1>
            <p className="text-[var(--text-muted)] font-medium text-base sm:text-lg leading-relaxed max-w-xl">
              Handles the technical debt so you don't have to. Real human responses, but please be patient—I have lectures.
            </p>
          </div>

          <div className="shrink-0 flex flex-col gap-4 w-full sm:w-auto">
            <div className={`p-4 sm:p-5 rounded-2xl border ${config.occupiedMode ? 'bg-amber-500/10 border-amber-500/20 text-amber-500' : 'bg-emerald-500/10 border-emerald-500/20 text-[#10b981]'} transition-colors duration-500`}>
              <div className="flex items-center gap-2 mb-2 sm:mb-1">
                <div className={`w-2 h-2 rounded-full ${config.occupiedMode ? 'bg-amber-500' : 'bg-[#10b981]'} animate-pulse`} />
                <span className="text-[10px] font-black uppercase tracking-widest leading-none">Developer Status</span>
              </div>
              <div className="flex items-center gap-3">
                 <GraduationCap className="w-5 h-5 flex-shrink-0" />
                 <span className="text-sm font-bold uppercase tracking-tight">
                    {config.occupiedMode ? 'Om is Studying — Delayed' : 'Online — Fast Response'}
                 </span>
              </div>
            </div>
            
            <div className="text-[9px] text-[var(--text-muted)] font-bold uppercase tracking-widest text-right lg:text-right px-2 lg:px-0">
               Typical Latency: {config.occupiedMode ? '~12 Hours' : '< 4 Hours'}
            </div>
          </div>
        </div>

        {/* Troubleshooting Section */}
        <div className="space-y-6">
          <h3 className="text-xs font-black uppercase tracking-[0.3em] text-[var(--text-muted)]">Common Stack Traces</h3>
          <div className="space-y-3">
            {issues.map((issue) => (
              <div key={issue.id} className="bg-[var(--bg-card)] border border-[var(--border-subtle)] rounded-2xl overflow-hidden transition-all hover:border-[#10b981]/30">
                <button 
                  onClick={() => setActiveTab(activeTab === issue.id ? null : issue.id)}
                  className="w-full text-left p-6 flex justify-between items-center gap-4"
                >
                  <span className="text-sm font-bold text-[var(--text-main)] uppercase tracking-tight">{issue.q}</span>
                  <ChevronRight className={`w-4 h-4 text-[var(--text-muted)] transition-transform duration-300 ${activeTab === issue.id ? 'rotate-90 text-[#10b981]' : ''}`} />
                </button>
                <AnimatePresence>
                  {activeTab === issue.id && (
                    <motion.div 
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="border-t border-[var(--border-subtle)] bg-[var(--bg-main)]/50"
                    >
                      <div className="p-6 text-sm text-[var(--text-muted)] leading-relaxed font-medium">
                        {issue.a}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ))}
          </div>
        </div>

        {/* LaTeX Preview Tooltip */}
        <div className="p-8 bg-blue-500/5 border border-blue-500/20 rounded-3xl relative overflow-hidden group">
           <div className="absolute top-0 right-0 p-8 opacity-5 pointer-events-none">
              <FileCode className="w-48 h-48 text-blue-400" />
           </div>
           <div className="relative z-10 space-y-4">
              <h4 className="flex items-center gap-2 text-blue-400 text-xs font-black uppercase tracking-widest">
                 <FileCode className="w-4 h-4" /> The Power of LaTeX
              </h4>
              <p className="text-[13px] text-[var(--text-muted)] leading-relaxed max-w-xl">
                 Unlike Word, LaTeX treats your resume as code. This ensures pixel-perfect consistency across all ATS parsers. 
                 <span className="text-blue-400 font-bold ml-1">It's how the top 1% of engineers format their profiles.</span>
              </p>
              <div className="bg-[#0f172a] rounded-xl p-4 font-mono text-[10px] text-blue-300/80 border border-blue-500/10">
                 {`\\begin{document}\n  \\section{Experience}\n  \\resumeItem{Built cloud-native systems...}\n\\end{document}`}
              </div>
           </div>
        </div>

        {/* Contact CTA */}
        <div className="pt-20 border-t border-[var(--border-subtle)] flex flex-col items-center text-center space-y-6">
           <div className="p-4 bg-[#10b981]/10 rounded-full">
              <MessageSquare className="w-8 h-8 text-[#10b981]" />
           </div>
           <div className="space-y-2">
              <h2 className="text-3xl font-black text-[var(--text-main)] uppercase tracking-tighter">Still Stuck?</h2>
              <p className="text-[var(--text-muted)] font-medium">For manual formatting requests or urgent bug fixes, reach out.</p>
           </div>
           <a 
              href="https://wa.me/919022826027" 
              target="_blank"
              className="bg-[#10b981] hover:bg-emerald-400 text-white px-10 py-5 rounded-2xl font-black uppercase tracking-widest transition-all shadow-xl hover:scale-105 active:scale-95"
           >
              Message Om Directly
           </a>
        </div>

      </div>
    </div>
  );
};

export default Support;
