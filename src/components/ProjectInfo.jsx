import React from 'react';
import { motion } from 'framer-motion';
import { 
  Terminal, 
  Cpu, 
  Workflow, 
  ShieldCheck, 
  Zap, 
  Code2, 
  FileJson, 
  Layers, 
  LineChart,
  Bot
} from 'lucide-react';

const ProjectInfo = () => {
  const specs = [
    {
      icon: <Cpu className="w-5 h-5 text-[#10b981]" />,
      label: "Intelligence Engine",
      value: "Gemini 2.5 Flash",
      desc: "Low-latency multimodal model optimized for structural analysis and contextual keyword mapping."
    },
    {
      icon: <Terminal className="w-5 h-5 text-blue-400" />,
      label: "Production Suite",
      value: "Professional LaTeX",
      desc: "Deterministic typesetting using the Knuth-Plass algorithm for pixel-perfect ATS compatibility."
    },
    {
      icon: <Workflow className="w-5 h-5 text-purple-400" />,
      label: "Development Factory",
      value: "GitHub Copilot + Custom AI",
      desc: "Architected using a specialized human-AI workflow, balancing automated efficiency with engineering precision."
    },
    {
      icon: <Code2 className="w-5 h-5 text-amber-500" />,
      label: "Frontend Stack",
      value: "React 19 + Tailwind v4",
      desc: "Modern reactive architecture utilizing high-fidelity Framer Motion physics and dynamic variables."
    }
  ];

  const workflowSteps = [
    { title: "Analysis", desc: "Raw text is extracted and normalized for the LLM context window." },
    { title: "Vector Check", desc: "Experience vs. Job Description matching across structural nodes." },
    { title: "Refinement", desc: "AI-driven improvement suggestions for bullet points and headers." },
    { title: "Typesetting", desc: "Final conversion to LaTeX for industry-standard reliability." }
  ];

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
      className="bg-[var(--bg-main)] min-h-screen pt-28 pb-20 px-4 sm:px-6 font-sans selection:bg-[#10b981]/30 transition-colors duration-300"
    >
      <div className="max-w-6xl mx-auto space-y-16 md:space-y-24">
        
        {/* Hero Section */}
        <div className="space-y-6 max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded bg-[#10b981]/10 border border-[#10b981]/20 text-[#10b981] text-[10px] font-black uppercase tracking-[0.2em]">
            System Documentation v2.5
          </div>
          <h1 className="text-4xl md:text-6xl font-black text-[var(--text-main)] uppercase tracking-tighter leading-none">
            Built for <span className="text-[#10b981]">Precision.</span><br />
            Optimized for <span className="text-[var(--text-muted)]">Students.</span>
          </h1>
          <p className="text-[var(--text-muted)] text-base md:text-lg font-medium leading-relaxed">
            ATSMASTER isn't just a tool; it's a technical experiment in human-AI collaboration. 
            Designed to bridge the gap between student resumes and corporate algorithms.
          </p>
        </div>

        {/* Core Specs Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
          {specs.map((spec, idx) => (
            <motion.div 
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
              viewport={{ once: true }}
              className="p-6 md:p-8 bg-[var(--bg-card)] border border-[var(--border-subtle)] rounded-3xl space-y-4 hover:border-[#10b981]/30 transition-all"
            >
              <div className="flex items-center gap-3">
                {spec.icon}
                <span className="text-xs font-black uppercase tracking-widest text-[var(--text-main)]">{spec.label}</span>
              </div>
              <h3 className="text-xl md:text-2xl font-black text-[var(--text-main)] leading-none">{spec.value}</h3>
              <p className="text-[13px] md:text-sm text-[var(--text-muted)] leading-relaxed font-medium">
                {spec.desc}
              </p>
            </motion.div>
          ))}
        </div>

        {/* The Workflow / Manufacturing */}
        <div className="relative p-6 sm:p-10 bg-[#0f172a] rounded-[2rem] sm:rounded-[2.5rem] border border-[var(--border-subtle)] overflow-hidden">
          <div className="absolute top-0 right-0 p-12 opacity-5 pointer-events-none">
            <Bot className="w-64 h-64 text-[#10b981]" />
          </div>
          
          <div className="relative z-10 space-y-8 md:space-y-12">
            <div className="space-y-4">
              <h2 className="text-[10px] font-black uppercase tracking-[0.3em] text-[#10b981]">The Development Workflow</h2>
              <p className="text-xl md:text-2xl font-bold text-white max-w-2xl leading-tight italic">
                "GitHub Copilot is my main factory. Combined with more AI tools, I'm perfecting a workflow that seeks to be 0.1% better every single day."
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 md:gap-8">
              {workflowSteps.map((step, idx) => (
                <div key={idx} className="space-y-2">
                  <div className="text-[10px] font-black text-[#10b981] opacity-50 tracking-widest">STEP 0{idx + 1}</div>
                  <h4 className="font-bold text-white text-xs sm:text-sm uppercase tracking-tight">{step.title}</h4>
                  <p className="text-[11px] text-slate-400 font-medium leading-relaxed">{step.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Philosophy Footer */}
        <div className="pt-20 border-t border-[var(--border-subtle)] flex flex-col md:flex-row justify-between items-center gap-8">
           <div className="flex items-center gap-6">
              <div className="space-y-1">
                 <h4 className="text-sm font-black text-[var(--text-main)] uppercase tracking-tighter">OmNox</h4>
                 <p className="text-[10px] text-[var(--text-muted)] font-bold uppercase tracking-widest">Lead System Architect</p>
              </div>
           </div>

           <div className="flex items-center gap-4 px-6 py-3 bg-[var(--bg-card)] rounded-full border border-[var(--border-subtle)]">
              <div className="w-2 h-2 rounded-full bg-[#10b981] animate-pulse" />
              <span className="text-[10px] font-black text-[var(--text-muted)] uppercase tracking-widest">
                Incremental Progress Cache: +0.1% Quality Boost Active
              </span>
           </div>
        </div>
      </div>
    </motion.div>
  );
};

export default ProjectInfo;
