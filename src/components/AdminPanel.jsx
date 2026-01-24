import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';
import { Shield, Lock, Save, AlertCircle, CheckCircle2, Moon, Sun } from 'lucide-react';

const AdminPanel = () => {
    const [password, setPassword] = useState('');
    const [authenticated, setAuthenticated] = useState(false);
    const [config, setConfig] = useState(null);
    const [message, setMessage] = useState({ type: '', text: '' });
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        const fetchConfig = async () => {
            try {
                const resp = await axios.get('/api/config');
                setConfig(resp.data);
            } catch (e) {
                setMessage({ type: 'error', text: 'Failed to load configuration' });
            }
        };
        fetchConfig();
    }, []);

    const handleLogin = (e) => {
        e.preventDefault();
        if (password === 'admin123') { // Same as backend
            setAuthenticated(true);
            setMessage({ type: 'success', text: 'Authenticated' });
        } else {
            setMessage({ type: 'error', text: 'Invalid password' });
        }
    };

    const handleUpdate = async () => {
        setIsLoading(true);
        try {
            await axios.post('/api/config/update', { password, config });
            setMessage({ type: 'success', text: 'Configuration updated successfully!' });
        } catch (e) {
            setMessage({ type: 'error', text: 'Failed to update configuration' });
        } finally {
            setIsLoading(false);
        }
    };

    if (!authenticated) {
        return (
            <div className="min-h-screen bg-[var(--bg-main)] flex items-center justify-center p-6">
                <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="w-full max-w-md bg-[var(--bg-card)] border border-[var(--border-subtle)] rounded-3xl p-10 shadow-2xl space-y-8"
                >
                    <div className="flex flex-col items-center gap-4">
                        <div className="p-4 bg-[#10b981]/10 rounded-2xl border border-[#10b981]/20">
                            <Shield className="w-10 h-10 text-[#10b981]" />
                        </div>
                        <h2 className="text-2xl font-black text-[var(--text-main)] uppercase tracking-tight">Access Control</h2>
                    </div>

                    <form onSubmit={handleLogin} className="space-y-6">
                        <div className="space-y-2">
                            <label className="text-[10px] font-black uppercase tracking-widest text-[var(--text-muted)] ml-1">Master Password</label>
                            <div className="relative">
                                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--text-muted)]" />
                                <input 
                                    type="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    placeholder="••••••••"
                                    className="w-full bg-[var(--bg-main)] border border-[var(--border-subtle)] rounded-xl py-4 pl-12 pr-4 text-[var(--text-main)] focus:ring-2 focus:ring-[#10b981]/20 outline-none transition-all"
                                />
                            </div>
                        </div>
                        <button 
                            type="submit"
                            className="w-full bg-[#10b981] hover:bg-emerald-400 text-white font-black uppercase tracking-widest py-4 rounded-xl transition-all shadow-lg"
                        >
                            Enter Terminal
                        </button>
                    </form>

                    {message.text && (
                        <div className={`p-4 rounded-xl flex items-center gap-3 text-sm font-bold ${message.type === 'error' ? 'bg-red-500/10 text-red-500 border border-red-500/20' : 'bg-emerald-500/10 text-emerald-500 border border-emerald-500/20'}`}>
                            {message.type === 'error' ? <AlertCircle className="w-4 h-4" /> : <CheckCircle2 className="w-4 h-4" />}
                            {message.text}
                        </div>
                    )}
                </motion.div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[var(--bg-main)] pt-32 pb-20 px-6">
            <div className="max-w-4xl mx-auto space-y-8">
                <div className="flex justify-between items-end">
                    <div className="space-y-2">
                        <h1 className="text-4xl font-black text-[var(--text-main)] uppercase tracking-tighter">System <span className="text-[#10b981]">Settings</span></h1>
                        <p className="text-[var(--text-muted)] font-medium">Remote control for ATSMASTER features</p>
                    </div>
                    <button 
                        onClick={handleUpdate}
                        disabled={isLoading}
                        className="flex items-center gap-2 bg-[#10b981] hover:bg-emerald-400 text-white px-8 py-3 rounded-xl font-black uppercase tracking-widest text-xs transition-all shadow-xl disabled:opacity-50"
                    >
                        {isLoading ? <Save className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                        Save Changes
                    </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Hiring Control */}
                    <div className="bg-[var(--bg-card)] border border-[var(--border-subtle)] rounded-3xl p-8 space-y-6">
                        <h3 className="text-xs font-black uppercase tracking-[0.2em] text-[#10b981]">Service Management</h3>
                        
                        <div className="space-y-4">
                            <label className="flex items-center justify-between p-4 bg-[var(--bg-main)] rounded-2xl border border-[var(--border-subtle)] cursor-pointer hover:border-[#10b981]/50 transition-all">
                                <span className="font-bold text-[var(--text-main)]">Hiring Availability</span>
                                <input 
                                    type="checkbox"
                                    checked={config?.hiringEnabled}
                                    onChange={(e) => setConfig({...config, hiringEnabled: e.target.checked})}
                                    className="w-10 h-6 bg-gray-200 rounded-full appearance-none checked:bg-[#10b981] transition-all relative cursor-pointer before:content-[''] before:absolute before:w-4 before:h-4 before:bg-white before:rounded-full before:top-1 before:left-1 before:transition-all checked:before:left-5"
                                />
                            </label>

                            <label className="flex items-center justify-between p-4 bg-[var(--bg-main)] rounded-2xl border border-[var(--border-subtle)] cursor-pointer hover:border-[#10b981]/50 transition-all">
                                <span className="font-bold text-[var(--text-main)]">Under Load (Busy)</span>
                                <input 
                                    type="checkbox"
                                    checked={config?.occupiedMode}
                                    onChange={(e) => setConfig({...config, occupiedMode: e.target.checked})}
                                    className="w-10 h-6 bg-gray-200 rounded-full appearance-none checked:bg-amber-500 transition-all relative cursor-pointer before:content-[''] before:absolute before:w-4 before:h-4 before:bg-white before:rounded-full before:top-1 before:left-1 before:transition-all checked:before:left-5"
                                />
                            </label>
                        </div>
                    </div>

                    {/* Operational Control */}
                    <div className="bg-[var(--bg-card)] border border-[var(--border-subtle)] rounded-3xl p-8 space-y-6">
                        <h3 className="text-xs font-black uppercase tracking-[0.2em] text-red-500">Service Pricing</h3>
                        
                        <div className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <span className="text-[9px] font-black uppercase tracking-widest text-[var(--text-muted)] ml-1">Service Fee (₹)</span>
                                    <input 
                                        type="number"
                                        value={config?.serviceFee || 0}
                                        onChange={(e) => setConfig({...config, serviceFee: parseInt(e.target.value)})}
                                        className="w-full bg-[var(--bg-main)] border border-[var(--border-subtle)] rounded-xl p-4 text-sm font-bold text-[var(--text-main)] outline-none"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <span className="text-[9px] font-black uppercase tracking-widest text-[var(--text-muted)] ml-1">Update Fee (₹)</span>
                                    <input 
                                        type="number"
                                        value={config?.updateFee || 0}
                                        onChange={(e) => setConfig({...config, updateFee: parseInt(e.target.value)})}
                                        className="w-full bg-[var(--bg-main)] border border-[var(--border-subtle)] rounded-xl p-4 text-sm font-bold text-[var(--text-main)] outline-none"
                                    />
                                </div>
                            </div>

                            <label className="flex items-center justify-between p-4 bg-[var(--bg-main)] rounded-2xl border border-[var(--border-subtle)] cursor-pointer hover:border-red-500/50 transition-all">
                                <span className="font-bold text-[var(--text-main)]">Maintenance Mode</span>
                                <input 
                                    type="checkbox"
                                    checked={config?.maintenanceMode}
                                    onChange={(e) => setConfig({...config, maintenanceMode: e.target.checked})}
                                    className="w-10 h-6 bg-gray-200 rounded-full appearance-none checked:bg-red-500 transition-all relative cursor-pointer before:content-[''] before:absolute before:w-4 before:h-4 before:bg-white before:rounded-full before:top-1 before:left-1 before:transition-all checked:before:left-5"
                                />
                            </label>
                            
                            <div className="space-y-2">
                                <span className="text-[9px] font-black uppercase tracking-widest text-[var(--text-muted)] ml-1">Alert Banner text</span>
                                <textarea 
                                    value={config?.alertMessage || ''}
                                    onChange={(e) => setConfig({...config, alertMessage: e.target.value})}
                                    placeholder="Enter system announcement..."
                                    className="w-full bg-[var(--bg-main)] border border-[var(--border-subtle)] rounded-xl p-4 text-xs font-medium text-[var(--text-main)] min-h-[100px] outline-none"
                                />
                            </div>
                        </div>
                    </div>
                </div>

                {message.text && (
                    <div className={`p-6 rounded-2xl flex items-center justify-center gap-3 text-sm font-bold animate-in fade-in duration-300 ${message.type === 'error' ? 'bg-red-500/10 text-red-500 border border-red-500/20' : 'bg-emerald-500/10 text-emerald-500 border border-emerald-500/20'}`}>
                        {message.type === 'error' ? <AlertCircle className="w-5 h-5" /> : <CheckCircle2 className="w-5 h-5" />}
                        {message.text}
                    </div>
                )}
            </div>
        </div>
    );
};

export default AdminPanel;
