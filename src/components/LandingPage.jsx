import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Key, Terminal, BrainCircuit, Info, Lightbulb, SearchCode, Shield, Zap } from 'lucide-react';

const LandingPage = () => {
  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
      className="bg-[var(--bg-main)] text-[var(--text-main)] font-sans selection:bg-[#10b981]/30 min-h-screen transition-colors duration-300"
    >
      <section className="relative pt-24 pb-12 lg:pt-36 overflow-hidden min-h-screen flex flex-col justify-start">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 w-full">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            <div className="space-y-6 lg:space-y-8">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded bg-[var(--bg-card)] border border-[var(--border-subtle)] text-[#10b981] text-[10px] font-bold uppercase tracking-[0.2em]">
                Simple Student Resume Helper
              </div>
              <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight leading-[1.1] text-[var(--text-main)]">
                Understand your resume structure with <span className="text-[#10b981]">ATSMASTER.</span>
              </h1>
              <p className="text-[var(--text-muted)] text-base md:text-lg lg:text-xl max-w-xl leading-relaxed">
                A student-built tool to help you identify missing keywords and formatting issues. We provide structural improvement and professional LaTeX typesetting.
              </p>
              <div className="flex flex-col sm:flex-row items-center gap-4 pt-4">
                <Link to="/analyzer" className="w-full sm:w-auto bg-[#10b981] text-white hover:bg-emerald-400 px-10 py-4 rounded-xl font-bold text-lg transition-all shadow-xl text-center">
                  Start Your Check
                </Link>
                <a href="https://github.com/omnox-dev/ATS" target="_blank" className="w-full sm:w-auto border border-[var(--border-subtle)] text-[var(--text-main)] hover:bg-[var(--bg-card)] px-10 py-4 rounded-xl font-bold text-lg transition-all text-center">
                  View on GitHub
                </a>
              </div>
              <p className="text-xs text-[var(--text-muted)] italic">
                *Disclosure: This is a helper tool for students. A "high match" does not guarantee a job or interview.
              </p>
            </div>
            
            <div className="relative">
              <div className="bg-[var(--bg-card)] p-6 sm:p-8 rounded-2xl border border-[var(--border-subtle)] backdrop-blur-sm">
                <h2 className="text-lg sm:text-xl font-bold mb-6 flex items-center gap-3 text-[var(--text-main)]">
                   <div className="bg-[var(--bg-card)] p-1.5 rounded border border-[var(--border-subtle)]">
                    <Info className="w-4 h-4 text-[#10b981]" />
                   </div>
                   Core Features
                </h2>
                <div className="space-y-6">
                  <div className="flex gap-4">
                    <div className="bg-[var(--bg-card)] p-2 rounded-lg h-fit border border-[var(--border-subtle)]">
                      <Key className="w-5 h-5 text-[#10b981]" />
                    </div>
                    <div>
                      <h3 className="font-bold text-[var(--text-main)] text-sm">Bring Your Own Key (BYOK)</h3>
                      <p className="text-xs text-[var(--text-muted)] mt-1">Use your own Gemini API Key. Your keys are never stored on any server, ensuring 100% privacy.</p>
                    </div>
                  </div>
                  <div className="flex gap-4">
                    <div className="bg-[var(--bg-card)] p-2 rounded-lg h-fit border border-[var(--border-subtle)]">
                      <Terminal className="w-5 h-5 text-[#10b981]" />
                    </div>
                    <div>
                      <h3 className="font-bold text-[var(--text-main)] text-sm">Structure Check</h3>
                      <p className="text-xs text-[var(--text-muted)] mt-1">Identify simple formatting errors like multi-column layouts that confuse older ATS parsers.</p>
                    </div>
                  </div>
                  <div className="flex gap-4">
                    <div className="bg-[var(--bg-card)] p-2 rounded-lg h-fit border border-[var(--border-subtle)]">
                      <BrainCircuit className="w-5 h-5 text-[#10b981]" />
                    </div>
                    <div>
                      <h3 className="font-bold text-[var(--text-main)] text-sm">Gemini-Powered Tips</h3>
                      <p className="text-xs text-[var(--text-muted)] mt-1">Get AI-generated suggestions on which missing keywords to add to your bullet points.</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Philosophy Section */}
      <section className="py-24 border-t border-[var(--border-subtle)]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-6">
            <div className="max-w-2xl">
              <h2 className="font-display text-3xl font-bold mb-4 text-[var(--text-main)]">Student-First Philosophy</h2>
              <p className="text-[var(--text-muted)]">We believe in transparent tools that help you learn how the industry works, without the corporate jargon.</p>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-1 ring-1 ring-[var(--border-subtle)] rounded-lg overflow-hidden">
            <div className="p-8 bg-[var(--bg-card)] hover:opacity-90 transition-all border-r border-[var(--border-subtle)] last:border-0">
              <Lightbulb className="w-8 h-8 text-[#10b981] mb-6" />
              <h3 className="text-lg font-bold mb-3 text-[var(--text-main)]">Contextual Matching</h3>
              <p className="text-[var(--text-muted)] text-sm leading-relaxed">It's not just about words. Our logic tries to understand if your experience actually matches the responsibilities.</p>
            </div>
            <div className="p-8 bg-[var(--bg-card)] hover:opacity-90 transition-all border-r border-[var(--border-subtle)] last:border-0">
              <SearchCode className="w-8 h-8 text-[#10b981] mb-6" />
              <h3 className="text-lg font-bold mb-3 text-[var(--text-main)]">Layout Audits</h3>
              <p className="text-[var(--text-muted)] text-sm leading-relaxed">We simulate how simple text extraction looks to a computer, helping you avoid "unreadable" resume pitfalls.</p>
            </div>
            <div className="p-8 bg-[var(--bg-card)] hover:opacity-90 transition-all border-r border-[var(--border-subtle)] last:border-0">
              <Shield className="w-8 h-8 text-[#10b981] mb-6" />
              <h3 className="text-lg font-bold mb-3 text-[var(--text-main)]">Data Honesty</h3>
              <p className="text-[var(--text-muted)] text-sm leading-relaxed">No data collection. No selling your info. Just a clean, open-source tool for peer-to-peer career help.</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-[#1e293b] border border-slate-700 rounded-3xl overflow-hidden shadow-2xl">
            <div className="grid lg:grid-cols-2">
              <div className="p-12 lg:p-16 flex flex-col justify-center">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded bg-emerald-500/10 border border-emerald-500/20 text-[#10b981] text-[10px] font-black uppercase tracking-widest mb-6 w-fit">
                    Neural Ready
                </div>
                <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold mb-6 text-white leading-tight uppercase tracking-tighter">Ready to <span className="text-[#10b981]">Upgrade</span> your career?</h2>
                <p className="text-slate-400 mb-10 text-base sm:text-lg font-medium">Use the analyzer for free or hire a student expert for professional LaTeX typesetting starting at <span className="text-white font-bold">₹69</span>.</p>
                <div className="flex flex-col sm:flex-row gap-4">
                  <Link to="/analyzer" className="bg-[#10b981] text-[#0f172a] px-8 py-4 rounded-xl font-bold hover:bg-emerald-400 transition-all text-center uppercase tracking-widest text-xs">
                    Go to Analyzer
                  </Link>
                  <button onClick={() => window.open('https://github.com/omnox-dev/ATS')} className="text-white px-8 py-4 rounded-xl font-bold border border-slate-600 hover:border-slate-400 transition-colors text-center uppercase tracking-widest text-xs">
                    Open Source 
                  </button>
                </div>
              </div>
              <div className="bg-slate-800/50 border-t lg:border-t-0 lg:border-l border-slate-700 p-8 sm:p-12 lg:p-16 flex items-center justify-center relative overflow-hidden">
                <div className="absolute inset-0 opacity-10 pointer-events-none bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-[#10b981] via-transparent to-transparent"></div>
                <div className="grid grid-cols-2 gap-6 sm:gap-8 w-full relative z-10">
                  {[
                    { val: "₹69", label: "Min. Rate" },
                    { val: "2.5", label: "Flash Engine" },
                    { val: "100%", label: "Privacy Focus" },
                    { val: "Peer", label: "Community" }
                  ].map((stat, i) => (
                    <div key={i}>
                      <div className="text-2xl sm:text-3xl font-display font-bold text-white mb-1 tracking-tight">{stat.val}</div>
                      <div className="text-[9px] sm:text-[10px] text-slate-500 font-bold uppercase tracking-widest">{stat.label}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </motion.div>
  );
};

export default LandingPage;
