import React, { useState } from 'react';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Send, User, Briefcase, MessageSquare, CheckCircle, Zap, ShieldCheck } from 'lucide-react';

const HireMeModal = ({ isOpen, onClose, isOccupied, serviceFee, updateFee }) => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        project: 'Manual Optimization Check',
        details: ''
    });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSubmitted, setIsSubmitted] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        
        // 1. Get cached report data from session
        const activeReport = localStorage.getItem('last_analysis_results');
        const activeResume = localStorage.getItem('last_improved_resume');

        try {
            // 2. Submit to Backend (Automatic)
            await axios.post('/api/submit-optimization', {
                userData: formData,
                report: activeReport ? JSON.parse(activeReport) : null,
                optimizedText: activeResume || "No optimization generated yet."
            });

            // 3. WhatsApp Notification Overlay
            const waNumber = "919022826027"; // UPDATED NUMBER
            const msg = `*NEW OPTIMIZATION REQUEST*%0A%0A*Name:* ${formData.name}%0A*Email:* ${formData.email}%0A*Note:* I have submitted my report for manual review.`;
            
            window.open(`https://wa.me/${waNumber}?text=${msg}`, '_blank');
            
            setIsSubmitted(true);
            setTimeout(() => {
                setIsSubmitted(false);
                onClose();
            }, 3000);
        } catch (error) {
            alert("Submission failed. Please check your connection.");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-[9999] overflow-y-auto px-4 py-8">
                    {/* Background Overlay */}
                    <motion.div 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="fixed inset-0 bg-[var(--bg-main)]/80 backdrop-blur-xl pointer-events-auto"
                    />
                    
                    {/* Centering Wrapper */}
                    <div className="flex min-h-full items-center justify-center">
                        <motion.div 
                            initial={{ opacity: 0, scale: 0.95, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: 20 }}
                            className="relative w-full max-w-lg bg-[var(--bg-card)] border border-[var(--border-subtle)] rounded-3xl shadow-2xl flex flex-col pointer-events-auto"
                        >
                            {isOccupied && (
                                <div className="bg-amber-500/10 border-b border-amber-500/20 px-8 py-3 flex items-center gap-3 shrink-0">
                                    <Zap className="w-4 h-4 text-amber-500 animate-pulse" />
                                    <span className="text-[10px] font-black uppercase tracking-widest text-amber-500">Currently Occupied — Joining Waitlist</span>
                                </div>
                            )}

                            <div className="p-8 space-y-8">
                            <div className="flex justify-between items-start">
                                <div className="space-y-2">
                                    <h2 className="text-3xl font-black text-[var(--text-main)] uppercase tracking-tighter">Report <span className="text-[#10b981]">Verification</span></h2>
                                    <p className="text-[var(--text-muted)] text-sm font-medium">Submit your optimized report for manual human review.</p>
                                </div>
                                <button onClick={onClose} className="p-2 hover:bg-[var(--bg-main)] rounded-xl transition-colors">
                                    <X className="w-5 h-5 text-[var(--text-muted)]" />
                                </button>
                            </div>

                            {isSubmitted ? (
                                <motion.div 
                                    initial={{ opacity: 0, scale: 0.5 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    className="py-12 flex flex-col items-center justify-center text-center space-y-4"
                                >
                                    <div className="w-20 h-20 bg-emerald-500/10 rounded-full border-2 border-emerald-500/20 flex items-center justify-center">
                                        <CheckCircle className="w-10 h-10 text-[#10b981]" />
                                    </div>
                                    <div className="space-y-2">
                                        <h3 className="text-xl font-bold text-[var(--text-main)]">Sent Automatically!</h3>
                                        <p className="text-[var(--text-muted)] text-sm">Your report is now in my queue. See you on WhatsApp!</p>
                                    </div>
                                </motion.div>
                            ) : (
                                <form onSubmit={handleSubmit} className="space-y-4">
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="space-y-1.5">
                                            <label className="text-[9px] font-black uppercase tracking-widest text-[var(--text-muted)] ml-1">Your Name</label>
                                            <div className="relative">
                                                <User className="absolute left-4 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-[var(--text-muted)]" />
                                                <input 
                                                    required
                                                    type="text" 
                                                    value={formData.name}
                                                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                                                    className="w-full bg-[var(--bg-main)] border border-[var(--border-subtle)] rounded-xl py-3 pl-11 pr-4 text-sm text-[var(--text-main)] focus:ring-1 focus:ring-[#10b981]/30 transition-all outline-none"
                                                    placeholder="Omnox Member"
                                                />
                                            </div>
                                        </div>
                                        <div className="space-y-1.5">
                                            <label className="text-[9px] font-black uppercase tracking-widest text-[var(--text-muted)] ml-1">Submission Type</label>
                                            <div className="relative">
                                                <Briefcase className="absolute left-4 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-[var(--text-muted)]" />
                                                <input 
                                                    readOnly
                                                    value="Report Check"
                                                    className="w-full bg-[var(--bg-main)]/50 border border-[var(--border-subtle)] rounded-xl py-3 pl-11 pr-4 text-sm text-[var(--text-muted)] cursor-not-allowed"
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    <div className="space-y-1.5">
                                        <label className="text-[9px] font-black uppercase tracking-widest text-[var(--text-muted)] ml-1">Email / Phone</label>
                                        <input 
                                            required
                                            type="text" 
                                            value={formData.email}
                                            onChange={(e) => setFormData({...formData, email: e.target.value})}
                                            className="w-full bg-[var(--bg-main)] border border-[var(--border-subtle)] rounded-xl py-3 px-4 text-sm text-[var(--text-main)] focus:ring-1 focus:ring-[#10b981]/30 transition-all outline-none"
                                            placeholder="Where should I send the results?"
                                        />
                                    </div>

                                    <div className="space-y-1.5">
                                        <label className="text-[9px] font-black uppercase tracking-widest text-[var(--text-muted)] ml-1">Quick Note</label>
                                        <textarea 
                                            value={formData.details}
                                            onChange={(e) => setFormData({...formData, details: e.target.value})}
                                            className="w-full bg-[var(--bg-main)] border border-[var(--border-subtle)] rounded-xl p-4 text-sm text-[var(--text-main)] min-h-[100px] focus:ring-1 focus:ring-[#10b981]/30 transition-all outline-none resize-none"
                                            placeholder="Any specifics you want me to look at?"
                                        />
                                    </div>

                                    {/* Pricing Disclaimer */}
                                    <div className="p-4 bg-emerald-500/5 border border-[#10b981]/10 rounded-xl space-y-2">
                                        <div className="flex items-center gap-2">
                                            <ShieldCheck className="w-3.5 h-3.5 text-[#10b981]" />
                                            <span className="text-[10px] font-black uppercase tracking-widest text-[#10b981]">Manual Optimization Rates</span>
                                        </div>
                                        <div className="grid grid-cols-2 gap-4">
                                            <div>
                                                <p className="text-[9px] text-[var(--text-muted)] uppercase tracking-wide">Report Verification</p>
                                                <p className="text-xs font-bold text-[var(--text-main)]">₹{serviceFee || 69} (Applied)</p>
                                            </div>
                                            <div className="opacity-50">
                                                <p className="text-[9px] text-[var(--text-muted)] uppercase tracking-wide">Update/Edit Fee</p>
                                                <p className="text-xs font-bold text-[var(--text-main)]">₹{updateFee || 30}</p>
                                            </div>
                                        </div>
                                    </div>

                                    <button 
                                        type="submit"
                                        disabled={isSubmitting}
                                        className="w-full bg-[#10b981] hover:bg-emerald-400 disabled:opacity-50 text-white font-black uppercase tracking-widest py-4 rounded-xl transition-all shadow-lg flex items-center justify-center gap-3"
                                    >
                                        {isSubmitting ? <Loader2 className="w-5 h-5 animate-spin" /> : <Send className="w-4 h-4" />}
                                        Submit & Verify
                                    </button>
                                </form>
                            )}

                            <div className="pt-6 border-t border-[var(--border-subtle)] flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    <ShieldCheck className="w-4 h-4 text-[#10b981]" />
                                    <span className="text-[10px] font-bold text-[var(--text-muted)] uppercase tracking-tight">Verified Secure Communication</span>
                                </div>
                                <span className="text-[10px] font-black text-[#10b981] uppercase tracking-widest">Powered by WhatsApp</span>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </div>
            )}
        </AnimatePresence>
    );
};

export default HireMeModal;
