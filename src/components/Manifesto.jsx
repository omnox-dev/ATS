import React from 'react';
import { motion } from 'framer-motion';
import { Terminal, BrainCircuit, Shield, Cpu, Code2, Sparkles, Layers } from 'lucide-react';

const Manifesto = () => {
  return (
    <div className="bg-[var(--bg-main)] min-h-screen pt-32 pb-20 px-6 font-sans selection:bg-[#10b981]/30">
      <div className="max-w-4xl mx-auto space-y-24">
        
        {/* Header Section */}
        <div className="space-y-6">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 px-3 py-1 rounded bg-[var(--bg-card)] border border-[var(--border-subtle)] text-[#10b981] text-xs font-black uppercase tracking-[0.2em]"
          >
            <Terminal className="w-3 h-3" /> System Architecture v2.5
          </motion.div>
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-5xl md:text-7xl font-black text-[var(--text-main)] uppercase tracking-tight leading-[0.9]"
          >
            The System is Bugged. <br />
            <span className="text-[#10b981]">We Just Patched It.</span>
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-xl text-[var(--text-muted)] font-medium max-w-2xl leading-relaxed italic border-l-2 border-[var(--border-subtle)] pl-6"
          >
            "Great code doesn't always look like a great resume. We noticed a runtime error in the hiring process: companies are using Applicant Tracking Systems (ATS) that filter out talented engineers based on syntax rather than logic."
          </motion.p>
        </div>

        {/* Live Translation Graphic Mockup */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3 }}
          className="relative bg-[var(--bg-card)] border border-[var(--border-subtle)] rounded-3xl p-1 md:p-12 overflow-hidden"
        >
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-[#10b981] to-transparent opacity-50"></div>
          <div className="grid md:grid-cols-2 gap-8 items-center">
            <div className="space-y-4 opacity-40 grayscale group hover:grayscale-0 hover:opacity-100 transition-all duration-700">
               <div className="font-mono text-[10px] text-red-400 p-4 bg-red-400/5 rounded-xl border border-red-400/20">
                  {`// RAW INPUT (MISSING KEYWORDS)\n"I built a cloud app using some google tools and handled the data storage myself."`}
               </div>
               <div className="flex justify-center">
                 <div className="w-px h-8 bg-gradient-to-b from-red-400/20 to-transparent"></div>
               </div>
            </div>
            <div className="space-y-4">
               <div className="font-mono text-[10px] text-[#10b981] p-4 bg-[#10b981]/5 rounded-xl border border-[#10b981]/20 shadow-[0_0_30px_rgba(16,185,129,0.1)]">
                  {`// OPTIMIZED DATA (BY ATSMASTER)\n"Engineered highly scalable Cloud Native architectures utilizing GCP Orchestration and managed Persistence Layers."`}
               </div>
               <div className="flex justify-center">
                 <div className="w-px h-8 bg-gradient-to-b from-[#10b981]/20 to-transparent animate-pulse"></div>
               </div>
            </div>
          </div>
          <div className="mt-8 text-center">
             <span className="text-[10px] font-black uppercase tracking-[0.3em] text-[var(--text-muted)] animate-pulse">Semantic Translation Pipeline Active</span>
          </div>
        </motion.div>

        {/* Philosophy Grid */}
        <div className="grid md:grid-cols-3 gap-8">
          {[
            { 
              title: 'Local-First', 
              icon: Shield, 
              text: "Your data is yours. Our analysis runs client-side or on ephemeral edge functions. We don't store your resume." 
            },
            { 
              title: 'Open Architecture', 
              icon: Code2, 
              text: "We believe the 'Perfect Resume' shouldn't be a trade secret. That's why we use the open-standard LaTeX format." 
            },
            { 
              title: 'Skill Over Hype', 
              icon: BrainCircuit, 
              text: "We optimize for clarity and impact, not just buzzwords. We get you to the human interviewer." 
            }
          ].map((item, i) => (
            <motion.div 
              key={i}
              whileHover={{ y: -5 }}
              className="p-8 bg-[var(--bg-card)] border border-[var(--border-subtle)] rounded-2xl space-y-4 group"
            >
              <item.icon className="w-6 h-6 text-[#10b981] group-hover:rotate-12 transition-transform" />
              <h3 className="font-black uppercase tracking-wider text-sm text-[var(--text-main)]">{item.title}</h3>
              <p className="text-xs text-[var(--text-muted)] leading-relaxed font-medium">{item.text}</p>
            </motion.div>
          ))}
        </div>

        {/* Tech Stack */}
        <div className="pt-12 border-t border-[var(--border-subtle)]">
            <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-[var(--text-muted)] mb-8 text-center text-[#10b981]">Infrastructure Stack</h4>
            <div className="flex flex-wrap justify-center gap-8 opacity-30">
               <div className="flex items-center gap-2 group hover:opacity-100 transition-opacity">
                 <Sparkles className="w-5 h-5" /> <span className="text-xs font-bold font-mono">GEMINI-2.5</span>
               </div>
               <div className="flex items-center gap-2 group hover:opacity-100 transition-opacity">
                 <Layers className="w-5 h-5" /> <span className="text-xs font-bold font-mono">REACT-19</span>
               </div>
               <div className="flex items-center gap-2 group hover:opacity-100 transition-opacity">
                 <Cpu className="w-5 h-5" /> <span className="text-xs font-bold font-mono">VERCEL-EDGE</span>
               </div>
            </div>
        </div>

        {/* Final Statement */}
        <div className="text-center pt-20">
           <h2 className="text-3xl font-black text-[var(--text-main)] italic uppercase tracking-tighter">"Get you to the human. <span className="text-[#10b981]">The rest is up to you.</span>"</h2>
        </div>

      </div>
    </div>
  );
};

export default Manifesto;
