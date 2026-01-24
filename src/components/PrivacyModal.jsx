import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Shield, X, Lock, EyeOff, Server, HardDrive } from 'lucide-react';

const PrivacyModal = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  const policies = [
    {
      icon: <Lock className="w-5 h-5" />,
      title: "No PDF Storage",
      desc: "Your uploaded resumes are processed in memory and immediately discarded. I don't maintain a database of your personal files."
    },
    {
      icon: <EyeOff className="w-5 h-5" />,
      title: "Zero PII Persistence",
      desc: "Contact details, names, and addresses extracted during analysis are not saved unless you explicitly click 'Submit for Verification'."
    },
    {
      icon: <Server className="w-5 h-5" />,
      title: "Self-Hosted Analytics",
      desc: "I use minimal, privacy-first tracking to understand which parts of the tool are useful. No creepy cross-site cookies."
    },
    {
      icon: <HardDrive className="w-5 h-5" />,
      title: "Your Metadata, Your Choice",
      desc: "The only data saved is the 'Submission' report when you request an upgrade. This helps me verify your payment and improvements."
    }
  ];

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
        {/* Backdrop */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-[#020617]/90 backdrop-blur-md"
        />

        {/* Modal Content */}
        <motion.div
          initial={{ scale: 0.95, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.95, opacity: 0, y: 20 }}
          className="relative w-full max-w-2xl bg-[var(--bg-card)] border border-[var(--border-subtle)] rounded-[2.5rem] shadow-2xl overflow-hidden"
        >
          {/* Header */}
          <div className="p-8 border-b border-[var(--border-subtle)] flex justify-between items-center">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-emerald-500/10 rounded-xl">
                <Shield className="w-6 h-6 text-[#10b981]" />
              </div>
              <h2 className="text-xl font-black text-[var(--text-main)] uppercase tracking-tighter">System Privacy Policy</h2>
            </div>
            <button 
              onClick={onClose}
              className="p-2 hover:bg-[var(--bg-main)] rounded-full transition-colors"
            >
              <X className="w-5 h-5 text-[var(--text-muted)]" />
            </button>
          </div>

          {/* Body */}
          <div className="p-8 space-y-8 max-h-[70vh] overflow-y-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {policies.map((p, idx) => (
                <div key={idx} className="space-y-3">
                   <div className="text-[#10b981]">{p.icon}</div>
                   <h4 className="text-xs font-black uppercase tracking-widest text-[var(--text-main)]">{p.title}</h4>
                   <p className="text-[13px] text-[var(--text-muted)] leading-relaxed font-medium">
                      {p.desc}
                   </p>
                </div>
              ))}
            </div>

            <div className="p-6 bg-[#0f172a] rounded-2xl border border-[var(--border-subtle)] space-y-3">
               <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-[#10b981]">Developer Note</h4>
               <p className="text-[11px] text-[var(--text-muted)] leading-relaxed font-mono">
                  I built this tool to solve the same problem I have as a student. I have zero interest in selling data. 
                  Efficiency is the only goal here. If you have concerns, audit the network tab in your browser.
               </p>
            </div>
          </div>

          {/* Footer */}
          <div className="p-6 bg-[var(--bg-main)]/50 text-center">
            <button 
              onClick={onClose}
              className="w-full py-4 bg-[var(--text-main)] text-[var(--bg-main)] rounded-2xl font-black uppercase tracking-[0.2em] text-xs hover:bg-[#10b981] hover:text-white transition-all active:scale-95"
            >
              System Acknowledged
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default PrivacyModal;
