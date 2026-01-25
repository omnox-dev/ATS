import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import html2pdf from 'html2pdf.js';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FileSearch, 
  Loader2, 
  CheckCircle2, 
  AlertCircle, 
  Download, 
  FileText, 
  Smartphone, 
  ExternalLink, 
  X, 
  Upload,
  BarChart3, 
  Target, 
  Layers, 
  Verified, 
  AlertTriangle, 
  CheckCircle, 
  Info, 
  Terminal,
  Cpu,
  ArrowLeft,
  Zap,
  LayoutTemplate,
  ShieldCheck,
  BrainCircuit,
  Check,
  UserCheck,
  Clock
} from 'lucide-react';
import HireMeModal from './HireMeModal';

const SYSTEM_PROMPT = `
You are a strict, world-class Applicant Tracking System (ATS) simulator. Your sole purpose is to analyze a candidate's RESUME against a provided JOB DESCRIPTION.

You must perform the following actions:
1.  **Parseability Check:** First, check the RESUME for any obvious parsing errors like columns, tables, or special characters. Assume plain text is 100% parseable.
2.  **Keyword Matching:** Scour the RESUME for direct keyword matches from the JOB DESCRIPTION. Focus on skills, technologies, and required experience.
3.  **Metric Analysis:** Identify and extract quantifiable metrics from the RESUME (e.g., "5 hours", "12 reports", "2 days", "20% increase"). This is extremely important.
4.  **Scoring:** Provide an "overallScore" from 0 to 100, representing the percentage of the JOB DESCRIPTION that is covered by the RESUME.
5.  **Feedback:** Provide a "summary" of your findings, a list of "strengths" (direct keyword/concept matches), and a list of "weaknesses" (missing keywords/experience).

You MUST return your analysis ONLY in the specified JSON format. Do not include any other text.
`;

const JSON_SCHEMA = {
    type: "OBJECT",
    properties: {
        "overallScore": { type: "NUMBER" },
        "parseabilityScore": { type: "NUMBER" },
        "summary": { type: "STRING" },
        "strengths": { type: "ARRAY", items: { type: "STRING" } },
        "weaknesses": { type: "ARRAY", items: { type: "STRING" } }
    },
    required: ["overallScore", "parseabilityScore", "summary", "strengths", "weaknesses"]
};

const AnalysisReport = ({ results, improvedResume, onDownloadPdf, onDownloadTxt, onOptimize, isOptimizing, onClose, onVerify, config }) => {
    const score = results?.overallScore || 0;
    const parseScore = results?.parseabilityScore || 0;
    
    return (
      <motion.div 
        initial={{ y: "100%" }}
        animate={{ y: 0 }}
        exit={{ y: "100%" }}
        transition={{ type: "spring", damping: 25, stiffness: 200 }}
        className="fixed inset-0 z-50 bg-[var(--bg-main)] overflow-y-auto font-sans text-[var(--text-main)] transition-colors duration-300"
      >
        <div className="max-w-6xl mx-auto px-4 py-8 md:py-12 relative pb-32">
          {/* Top Bar */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6 mb-12">
            <button 
                onClick={onClose}
                className="flex items-center gap-2 text-[#10b981] text-[10px] font-black uppercase tracking-[0.3em] hover:translate-x-[-4px] transition-all bg-[var(--bg-card)] px-4 py-2 rounded border border-[var(--border-subtle)]"
              >
                <ArrowLeft className="w-3 h-3" /> Back
            </button>
            <div className="flex gap-2 w-full sm:w-auto">
               <button 
                onClick={onDownloadTxt}
                className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-4 sm:px-6 py-3 bg-[var(--bg-card)] border border-[var(--border-subtle)] rounded text-[10px] uppercase font-black tracking-widest text-[var(--text-muted)] hover:text-[var(--text-main)] transition-all shadow-xl"
              >
                <Download className="w-3.5 h-3.5" /> TXT
              </button>
              <button 
                onClick={onDownloadPdf}
                className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-4 sm:px-6 py-3 bg-[#10b981] hover:bg-emerald-400 text-white rounded text-[10px] uppercase font-black tracking-widest transition-all shadow-xl"
              >
                <Download className="w-3.5 h-3.5" /> PDF
              </button>
            </div>
          </div>

          <div className="mb-10 md:mb-16">
            <h2 className="text-3xl sm:text-5xl lg:text-6xl font-black text-[var(--text-main)] flex items-center gap-4 sm:gap-6 font-display tracking-tight uppercase transition-colors duration-300">
              Analysis <span className="text-[#10b981]">Suite</span>
            </h2>
            <p className="text-[var(--text-muted)] mt-4 text-xs sm:text-sm font-medium tracking-wide max-w-2xl leading-relaxed">
              Our neural engine has decomposed your resume structure and mapped it against the target requirements using semantic alignment protocols.
            </p>
          </div>
  
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 mb-8">
            {/* Match Score Gauge */}
            <div className="bg-[var(--bg-card)] border border-[var(--border-subtle)] p-8 sm:p-12 rounded-2xl flex flex-col items-center justify-center relative overflow-hidden backdrop-blur-sm group">
              <div className="absolute top-6 left-8 sm:top-8 sm:left-10">
                <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-[var(--text-muted)]">Sync Ratio</h3>
              </div>
              
              <div className="relative w-48 h-48 sm:w-64 sm:h-64 mt-4">
                <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                  <circle className="text-[var(--bg-main)] stroke-current" cx="50" cy="50" fill="transparent" r="44" strokeWidth="4"></circle>
                  <motion.circle 
                    initial={{ strokeDashoffset: 276 }}
                    animate={{ strokeDashoffset: 276 - (276 * score) / 100 }}
                    transition={{ duration: 2, ease: "circOut" }}
                    className="text-[#10b981] stroke-current" 
                    cx="50" cy="50" fill="transparent" r="44" 
                    strokeDasharray="276" 
                    strokeLinecap="round" 
                    strokeWidth="6"
                  ></motion.circle>
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <div className="flex items-baseline">
                    <span className="text-5xl sm:text-7xl font-black text-[var(--text-main)] font-display tracking-tighter transition-colors duration-300">{score}</span>
                    <span className="text-xl sm:text-2xl font-black text-[#10b981]/50 mb-1">%</span>
                  </div>
                  <div className="bg-[var(--bg-main)] px-3 sm:px-4 py-1.5 rounded border border-[var(--border-subtle)] mt-4">
                    <span className="text-[8px] sm:text-[9px] uppercase font-black text-[#10b981] tracking-[0.2em]">
                        {score > 80 ? 'Optimized' : score > 50 ? 'Stable' : 'Unstable'}
                    </span>
                  </div>
                </div>
              </div>

              {/* Ad Spot #1 - Subtle link */}
              <div className="mt-8 border-t border-[var(--border-subtle)] pt-6 w-full text-center group-hover:bg-[#10b981]/5 transition-colors">
                <span className="text-[8px] font-black uppercase tracking-widest text-[var(--text-muted)] block mb-1">Sponsored By</span>
                <span className="text-[10px] text-[#10b981] font-bold transition-colors duration-300">Craftexa Technologies</span>
              </div>
            </div>
  
            {/* Peer Benchmarking */}
            <div className="lg:col-span-2 bg-[var(--bg-card)] border border-[var(--border-subtle)] p-8 sm:p-12 rounded-2xl backdrop-blur-sm relative overflow-hidden transition-colors duration-300">
               <div className="absolute top-0 right-0 p-12 opacity-[0.02] pointer-events-none text-[var(--text-main)] transition-colors duration-300">
                <BarChart3 className="w-48 h-48 sm:w-64 sm:h-64" />
              </div>
              
              <div className="flex justify-between items-start mb-10 sm:mb-12 relative z-10 transition-colors duration-300">
                <div className="space-y-2">
                  <h3 className="text-[10px] sm:text-xs font-black uppercase tracking-[0.3em] text-[#10b981]">Competitive Landscape</h3>
                  <p className="text-[var(--text-muted)] text-xs sm:text-sm font-medium transition-colors duration-300">Distribution vs Entry-Level Market Avg</p>
                </div>
              </div>
  
              <div className="space-y-8 sm:space-y-10 relative z-10">
                <div className="space-y-4">
                  <div className="flex justify-between items-end">
                    <span className="text-[10px] font-black uppercase tracking-[0.2em] text-[var(--text-muted)] transition-colors duration-300">Technical Skill Overlay</span>
                    <span className="text-base sm:text-lg font-black text-[var(--text-main)] transition-colors duration-300">{score}% Match</span>
                  </div>
                  <div className="h-2 w-full bg-[var(--bg-main)] rounded-full relative overflow-hidden border border-[var(--border-subtle)] transition-colors duration-300">
                    <motion.div 
                      initial={{ width: 0 }}
                      animate={{ width: `${score}%` }}
                      transition={{ duration: 1.2, delay: 0.3 }}
                      className="h-full bg-[#10b981]"
                    ></motion.div>
                  </div>
                </div>
  
                <div className="space-y-4">
                  <div className="flex justify-between items-end">
                    <span className="text-[10px] font-black uppercase tracking-[0.2em] text-[var(--text-muted)] transition-colors duration-300">Structural Efficiency</span>
                    <span className="text-base sm:text-lg font-black text-[var(--text-main)] transition-colors duration-300">{parseScore}% Parse</span>
                  </div>
                  <div className="h-2 w-full bg-[var(--bg-main)] rounded-full relative overflow-hidden border border-[var(--border-subtle)] transition-colors duration-300">
                    <motion.div 
                      initial={{ width: 0 }}
                      animate={{ width: `${parseScore}%` }}
                      transition={{ duration: 1.2, delay: 0.5 }}
                      className="h-full bg-blue-500"
                    ></motion.div>
                  </div>
                </div>
              </div>
            </div>
          </div>
  
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8">
            {/* Logic Checks */}
            <div className="bg-[var(--bg-card)] border border-[var(--border-subtle)] rounded-2xl p-8 sm:p-12 relative overflow-hidden backdrop-blur-sm transition-colors duration-300">
              <h3 className="text-lg sm:text-xl font-black text-[var(--text-main)] mb-8 sm:mb-10 flex items-center gap-4 uppercase tracking-tight transition-colors duration-300">
                <Target className="text-[#10b981] w-5 h-5 sm:w-6 sm:h-6 border-2 border-[var(--border-subtle)] p-1 rounded" />
                Keyword Mapping
              </h3>
              
              <div className="space-y-8 sm:space-y-10">
                <div className="space-y-4">
                  <p className="text-[10px] font-black text-red-400/50 uppercase tracking-[0.3em] transition-colors duration-300">Critical Gaps identified</p>
                  <div className="flex flex-wrap gap-2 sm:gap-3">
                    {(results?.weaknesses || []).map((skill, i) => (
                      <div key={i} className="flex items-center gap-2 px-3 sm:px-4 py-2 bg-red-400/5 border border-red-500/20 rounded hover:bg-red-500/10 transition-all">
                        <AlertCircle className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-red-500" />
                        <span className="text-[9px] sm:text-[10px] font-bold text-[var(--text-muted)] uppercase tracking-wide transition-colors duration-300">{skill}</span>
                      </div>
                    ))}
                  </div>
                </div>
                
                <div className="pt-8 sm:pt-10 border-t border-[var(--border-subtle)] space-y-4 transition-colors duration-300">
                   <p className="text-[10px] font-black text-[#10b981]/50 uppercase tracking-[0.3em] transition-colors duration-300">Core Competencies found</p>
                   <div className="flex flex-wrap gap-2 sm:gap-3">
                    {(results?.strengths || []).map((skill, i) => (
                      <div key={i} className="flex items-center gap-2 px-3 sm:px-4 py-2 bg-[#10b981]/5 border border-[#10b981]/20 rounded hover:bg-[#10b981]/10 transition-all">
                        <CheckCircle className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-[#10b981]" />
                        <span className="text-[9px] sm:text-[10px] font-bold text-[var(--text-muted)] uppercase tracking-wide transition-colors duration-300">{skill}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
  
            {/* Analysis Summary */}
            <div className="bg-[var(--bg-card)] border border-[var(--border-subtle)] rounded-2xl p-8 sm:p-12 backdrop-blur-sm relative overflow-hidden flex flex-col self-start transition-colors duration-300">
              <div className="mb-8">
                  <div className="bg-[var(--bg-main)] w-fit p-3 rounded-xl mb-6 border border-[var(--border-subtle)]">
                    <BrainCircuit className="text-[#10b981] w-6 h-6 sm:w-8 sm:h-8" />
                  </div>
                  <h3 className="text-xl sm:text-2xl font-black text-[var(--text-main)] uppercase tracking-tight mb-4 font-display transition-colors duration-300">Neural Overview</h3>
                  <div className="text-[var(--text-muted)] text-sm sm:text-lg leading-relaxed font-medium whitespace-pre-wrap transition-colors duration-300">
                    {results?.summary}
                  </div>
              </div>

              <div className="pt-10 border-t border-[var(--border-subtle)] space-y-4">
                <button 
                    onClick={onOptimize}
                    disabled={isOptimizing}
                    className="w-full py-5 bg-[#10b981] hover:bg-emerald-400 disabled:bg-[var(--bg-card)] rounded font-black text-white disabled:text-[var(--text-muted)] uppercase tracking-[0.2em] text-xs transition-all flex items-center justify-center gap-4 group shadow-lg"
                >
                    {isOptimizing ? <Loader2 className="w-5 h-5 animate-spin text-[var(--text-muted)]" /> : <Zap className="w-5 h-5 fill-current text-white group-hover:scale-110 transition-transform" />}
                    <span className={isOptimizing ? 'text-[var(--text-muted)]' : 'text-white'}>
                        {isOptimizing ? 'Recalibrating Context...' : 'Improve Content'}
                    </span>
                </button>
              </div>

              {/* Generous Soft Message */}
              <div className="mt-8 p-6 rounded-xl border border-emerald-500/20 bg-emerald-500/5 group">
                <h4 className="flex items-center gap-2 text-[#10b981] text-[10px] font-black uppercase tracking-widest mb-3">
                  <Info className="w-3.5 h-3.5" /> Why is this free?
                </h4>
                <p className="text-xs text-[var(--text-muted)] leading-relaxed group-hover:text-[var(--text-main)] transition-colors">
                  As students, we understand the frustration of "Subscription Denied". 
                  We believe high-end AI shouldn't just be for the elite. 
                  This runs on <span className="text-[#10b981] font-bold">Gemini 2.5 Flash</span>. If it helps you get that interview, that’s our fee.
                </p>

                {config?.isOccupied && (
                   <div className="mt-6 pt-6 border-t border-emerald-500/10">
                      <p className="text-[10px] font-black text-amber-500 uppercase tracking-[0.2em] mb-2 flex items-center gap-2">
                        <Clock className="w-3 h-3" /> Waitlist Solution
                      </p>
                      <p className="text-[11px] text-[var(--text-muted)] leading-relaxed">
                        I am currently handling high volume. Use the button above to join the waitlist. I'll prioritize your report once a slot opens (Average wait: 24h).
                      </p>
                   </div>
                )}
              </div>
            </div>
          </div>

          {/* Improved Version Display (Conditional) */}
          <AnimatePresence>
            {improvedResume && (
                <motion.div 
                    initial={{ opacity: 0, scale: 0.98 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="mt-12 bg-[var(--bg-card)] border border-[var(--border-subtle)] rounded-2xl overflow-hidden"
                >
                    <div className="p-8 border-b border-[var(--border-subtle)] flex justify-between items-center bg-[var(--bg-card)]">
                         <div className="flex items-center gap-4">
                            <Verified className="text-[#10b981] w-5 h-5" />
                            <h4 className="text-sm font-black uppercase tracking-widest text-[var(--text-main)] transition-colors duration-300">Suggested Optimization</h4>
                        </div>
                    </div>
                    
                    {/* Golden Rules Overlay/Section */}
                    <div className="bg-blue-500/5 border-b border-[var(--border-subtle)] p-6 flex flex-col md:flex-row gap-6 items-center justify-between">
                        <div className="flex items-center gap-4">
                            <div className="bg-blue-500/20 p-2 rounded-lg">
                                <ShieldCheck className="text-blue-400 w-5 h-5" />
                            </div>
                            <div>
                                <h5 className="text-[10px] font-black uppercase tracking-widest text-blue-400">Golden Rules of Delivery</h5>
                                <p className="text-[11px] text-[var(--text-muted)]">Follow these to bypass 99% of automated rejections.</p>
                            </div>
                        </div>
                        <div className="flex gap-4">
                            <div className="flex items-center gap-2">
                                <div className="w-1.5 h-1.5 rounded-full bg-blue-500 shadow-[0_0_8px_rgba(59,130,246,0.5)]"></div>
                                <span className="text-[9px] font-bold uppercase tracking-wider text-[var(--text-muted)] transition-colors duration-300">Use LaTeX Format</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <div className="w-1.5 h-1.5 rounded-full bg-blue-500 shadow-[0_0_8px_rgba(59,130,246,0.5)]"></div>
                                <span className="text-[9px] font-bold uppercase tracking-wider text-[var(--text-muted)] transition-colors duration-300">No PII Privacy</span>
                            </div>
                        </div>
                    </div>

                    <div className="p-10">
                        <textarea 
                            readOnly 
                            className="w-full h-96 bg-transparent text-[var(--text-muted)] font-mono text-sm leading-relaxed outline-none border-none resize-none transition-colors duration-300"
                            value={improvedResume}
                        />
                    </div>
                </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    );
};

const ATSAnalyzer = () => {
    const [jobDescription, setJobDescription] = useState('');
    const [resume, setResume] = useState('');
    const [apiKey, setApiKey] = useState('');
    const [saveApiKey, setSaveApiKey] = useState(true);
    const [useProxy, setUseProxy] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [isParsingFiles, setIsParsingFiles] = useState(false);
    const [analysisResults, setAnalysisResults] = useState(null);
    const [showResultsOverlay, setShowResultsOverlay] = useState(false);
    const [improvedResume, setImprovedResume] = useState('');
    const [isGeneratingImprovement, setIsGeneratingImprovement] = useState(false);
    const [isGeneratingPdf, setIsGeneratingPdf] = useState(false);
    const [showDemoModal, setShowDemoModal] = useState(false);
    const [isHireModalOpen, setIsHireModalOpen] = useState(false);
    const [appConfig, setAppConfig] = useState({ 
        maintenanceMode: false, 
        hiringEnabled: true, 
        isOccupied: false,
        serviceFee: 69,
        updateFee: 30
    });

    // Fetch remote config
    useEffect(() => {
        const fetchConfig = async () => {
            try {
                const resp = await axios.get('/api/config');
                setAppConfig({
                    maintenanceMode: resp.data.maintenanceMode === true,
                    hiringEnabled: resp.data.hiringEnabled !== false,
                    isOccupied: resp.data.occupiedMode === true,
                    serviceFee: resp.data.serviceFee || 69,
                    updateFee: resp.data.updateFee || 30
                });
            } catch (e) {
                console.warn('Failed to fetch remote config, using defaults');
            }
        };
        fetchConfig();
    }, []);

    // Clear results when input changes
    useEffect(() => {
        if (analysisResults) {
            setAnalysisResults(null);
            setImprovedResume('');
            localStorage.removeItem('last_analysis_results');
            localStorage.removeItem('last_improved_resume');
        }
    }, [jobDescription, resume]);

    useEffect(() => {
        const stored = localStorage.getItem('ats_api_key');
        if (stored) setApiKey(stored);
    }, []);

    const handleFileUpload = async (event, type) => {
        const file = event.target.files[0];
        if (!file) return;
        if (file.type !== 'text/plain') {
            alert('Please upload a .txt file.');
            return;
        }
        setIsParsingFiles(true);
        try {
            const extractedText = await file.text();
            if (type === 'jd') setJobDescription(extractedText);
            else setResume(extractedText);
        } catch (error) {
            alert('Failed to read text file.');
        } finally {
            setIsParsingFiles(false);
        }
    };

    const clearApiKey = () => {
        localStorage.removeItem('ats_api_key');
        setApiKey('');
        setSaveApiKey(false);
    };

    const runAnalysis = async () => {
        if (!jobDescription || !resume) {
            alert('Please provide both Job Description and Resume.');
            return;
        }
        setIsLoading(true);
        if (saveApiKey && apiKey) localStorage.setItem('ats_api_key', apiKey);

        const aiPayload = {
            contents: [{ role: "user", parts: [{ text: `JD:\n${jobDescription}\n\nResume:\n${resume}` }] }],
            systemInstruction: { parts: [{ text: SYSTEM_PROMPT }] },
            generationConfig: {
                responseMimeType: "application/json",
                responseSchema: JSON_SCHEMA,
            }
        };

        const proxyPayload = { ...aiPayload, key: apiKey };
        let apiUrl = useProxy ? '/api/generate' : `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-09-2025:generateContent?key=${apiKey}`;

        try {
            const response = await axios.post(apiUrl, useProxy ? proxyPayload : aiPayload);
            const data = response.data;
            const text = data.candidates?.[0]?.content?.parts?.[0]?.text;

            if (text) {
                setAnalysisResults(JSON.parse(text));
                localStorage.setItem('last_analysis_results', text);
                setShowResultsOverlay(true);
                setImprovedResume('');
            }
        } catch (error) {
            console.error('Analysis error:', error);
            const status = error.response?.status;
            const errMsg = error.response?.data?.error?.message || error.message || '';
            
            // Auto-fallback on quota error if using proxy and have local key
            if (useProxy && apiKey && (status === 429 || errMsg.toLowerCase().includes('quota'))) {
                try {
                    const fallbackUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-09-2025:generateContent?key=${apiKey}`;
                    const response = await axios.post(fallbackUrl, aiPayload);
                    const text = response.data.candidates?.[0]?.content?.parts?.[0]?.text;
                    if (text) {
                        setAnalysisResults(JSON.parse(text));
                        localStorage.setItem('last_analysis_results', text);
                        setShowResultsOverlay(true);
                        setImprovedResume('');
                        return;
                    }
                } catch (fallbackErr) {
                    alert('Both Server and Local Key failed: ' + (fallbackErr.response?.data?.error?.message || fallbackErr.message));
                    return;
                }
            }

            if (status === 429 || errMsg.toLowerCase().includes('quota')) {
                alert('Analysis failed: Key limit reached. Please check your Gemini API quota.');
            } else {
                alert('Analysis failed: ' + errMsg);
            }
        } finally {
            setIsLoading(false);
        }
    };

    const generateImprovement = async () => {
        setIsGeneratingImprovement(true);
        const prompt = `
            Task: Strategically rewrite the provided RESUME to optimize for the JOB DESCRIPTION and fill specific KEYWORD GAPS.
            
            Context:
            - JOB DESCRIPTION: ${jobDescription}
            - IDENTIFIED GAPS: ${(analysisResults?.weaknesses || []).join(', ')}
            - ORIGINAL RESUME: ${resume}
            
            Instructions:
            1. Integrate missing keywords naturally into experience or skills sections.
            2. Maintain professional tone and 100% factual accuracy (do not invent experience).
            3. Use strong action verbs and quantifiable metrics where possible.
            4. Keep the format clean and ATS-friendly (plain text only).
            5. Focus on high-impact changes that will raise the "overallScore".
            
            Return ONLY the rewritten resume text. No introductory or closing remarks.
        `;
        
        const aiPayload = {
            contents: [{ role: 'user', parts: [{ text: prompt }] }],
            systemInstruction: { parts: [{ text: 'You are an expert Executive Career Coach and Professional LaTeX Typesetting Specialist.' }] },
            generationConfig: { 
                temperature: 0.7,
                topP: 0.95,
                maxOutputTokens: 2048,
                responseMimeType: 'text/plain' 
            }
        };

        const proxyPayload = { ...aiPayload, key: apiKey };
        const apiUrl = useProxy ? '/api/generate' : `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-09-2025:generateContent?key=${apiKey}`;

        try {
            const response = await axios.post(apiUrl, useProxy ? proxyPayload : aiPayload);
            const text = response.data.candidates?.[0]?.content?.parts?.[0]?.text;
            setImprovedResume(text);
            localStorage.setItem('last_improved_resume', text);
        } catch (error) {
            const status = error.response?.status;
            const errMsg = error.response?.data?.error?.message || error.message || '';
            
            // Auto-fallback on quota error
            if (useProxy && apiKey && (status === 429 || errMsg.toLowerCase().includes('quota'))) {
                try {
                    const fallbackUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-09-2025:generateContent?key=${apiKey}`;
                    const response = await axios.post(fallbackUrl, aiPayload);
                    const text = response.data.candidates?.[0]?.content?.parts?.[0]?.text;
                    if (text) {
                        setImprovedResume(text);
                        localStorage.setItem('last_improved_resume', text);
                        return;
                    }
                } catch (fallbackErr) {
                    console.error('Fallback improvement failed', fallbackErr);
                }
            }

            if (status === 429 || errMsg.toLowerCase().includes('quota')) {
                alert('Optimization failed: Key limit reached.');
            } else {
                alert('Optimization failed: ' + errMsg);
            }
        } finally {
            setIsGeneratingImprovement(false);
        }
    };

    const downloadTxt = () => {
        const text = improvedResume || (analysisResults ? JSON.stringify(analysisResults, null, 2) : 'No results');
        const blob = new Blob([text], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = improvedResume ? 'optimized_resume.txt' : 'analysis_report.txt';
        document.body.appendChild(a);
        a.click();
        a.remove();
    };

    const downloadPdf = async () => {
        const score = analysisResults?.overallScore || 0;
        const html = `
            <html>
            <head>
                <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;700;900&display=swap" rel="stylesheet">
                <style>
                    body { font-family: 'Inter', sans-serif; padding: 40px; color: #0f172a; line-height: 1.5; background: #ffffff; }
                    .header { display: flex; justify-content: space-between; align-items: center; border-bottom: 2px solid #e2e8f0; padding-bottom: 20px; margin-bottom: 30px; }
                    .logo { font-size: 28px; font-weight: 900; letter-spacing: -1.5px; color: #0f172a; text-transform: uppercase; }
                    .logo span { color: #10b981; }
                    .score-badge { background: #f0fdf4; border: 1px solid #bbf7d0; color: #166534; padding: 4px 12px; rounded: 9999px; font-size: 12px; font-weight: 700; text-transform: uppercase; }
                    .score-card { background: linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%); padding: 32px; border-radius: 16px; border: 1px solid #e2e8f0; margin-bottom: 32px; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1); }
                    .score-value { font-size: 56px; font-weight: 900; color: #10b981; line-height: 1; }
                    .section-title { font-size: 12px; font-weight: 800; text-transform: uppercase; letter-spacing: 0.1em; color: #64748b; margin-bottom: 16px; margin-top: 24px; display: flex; align-items: center; gap: 8px; }
                    .section-title::after { content: ''; flex: 1; height: 1px; background: #e2e8f0; }
                    .list-item { margin-bottom: 12px; font-size: 13px; display: flex; gap: 10px; align-items: flex-start; color: #334155; }
                    .bullet { color: #10b981; font-size: 16px; line-height: 1; }
                    .resume-box { background: #f8fafc; border: 1px solid #e2e8f0; padding: 32px; border-radius: 12px; font-family: 'Courier New', monospace; font-size: 11px; white-space: pre-wrap; color: #1e293b; position: relative; overflow: hidden; }
                    .resume-box::before { content: 'OPTIMIZED VERSION'; position: absolute; top: 12px; right: 12px; font-size: 9px; font-weight: 900; color: #94a3b8; letter-spacing: 0.1em; }
                    .footer { margin-top: 60px; font-size: 11px; color: #94a3b8; text-align: center; border-top: 1px solid #e2e8f0; padding-top: 24px; font-weight: 500; }
                </style>
            </head>
            <body>
                <div class="header">
                    <div class="logo">ATS<span>MASTER</span></div>
                    <div style="text-align: right;">
                        <div class="score-badge">Neural Analysis Report</div>
                        <div style="font-size: 11px; color: #64748b; margin-top: 4px;">Verified: ${new Date().toLocaleDateString()}</div>
                    </div>
                </div>

                <div class="score-card">
                    <div style="display: flex; gap: 48px; align-items: center;">
                        <div style="text-align: center;">
                            <div class="score-value">${score}%</div>
                            <div style="font-size: 11px; font-weight: 800; text-transform: uppercase; color: #64748b; margin-top: 4px;">Match Score</div>
                        </div>
                        <div style="flex: 1; border-left: 2px solid #e2e8f0; padding-left: 32px;">
                            <div style="font-size: 12px; font-weight: 800; text-transform: uppercase; color: #64748b; margin-bottom: 8px;">Analysis Summary</div>
                            <div style="font-size: 14px; color: #334155; font-weight: 500;">${analysisResults?.summary || 'No summary available.'}</div>
                        </div>
                    </div>
                </div>

                <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 40px; margin-bottom: 20px;">
                    <div>
                        <div class="section-title">Key Strengths</div>
                        ${(analysisResults?.strengths || []).map(s => `<div class="list-item"><span class="bullet">✓</span> <span>${s}</span></div>`).join('')}
                    </div>
                    <div>
                        <div class="section-title">Critical Gaps</div>
                        ${(analysisResults?.weaknesses || []).map(w => `<div class="list-item"><span class="bullet" style="color:#ef4444">•</span> <span>${w}</span></div>`).join('')}
                    </div>
                </div>

                ${improvedResume ? `
                    <div class="section-title">Strategically Optimized Resume</div>
                    <div class="resume-box">${improvedResume}</div>
                ` : ''}

                <div class="footer">
                            <div>Sponsored By <strong>Craftexa Technologies</strong></div>
                            <div style="margin-top: 5px;">This report was generated using ATSMASTER Neural Analysis. For peer-to-peer educational use only.</div>
                </div>
            </body>
            </html>
        `;

        try {
            setIsGeneratingPdf(true);
            console.log('Using high-quality client-side PDF generation...');
            const container = document.createElement('div');
            container.style.position = 'fixed';
            container.style.left = '-9999px';
            container.style.top = '0';
            container.innerHTML = html;
            document.body.appendChild(container);

            // Give fonts a moment to load
            await new Promise(resolve => setTimeout(resolve, 500));

            const opt = {
                margin: [0.3, 0.3],
                filename: `ATS_Report_${Date.now()}.pdf`,
                image: { type: 'jpeg', quality: 0.98 },
                html2canvas: { 
                    scale: 3, 
                    useCORS: true, 
                    letterRendering: true,
                    allowTaint: true,
                    logging: false
                },
                jsPDF: { unit: 'in', format: 'letter', orientation: 'portrait' }
            };

            await html2pdf().set(opt).from(container).save();
            document.body.removeChild(container);
        } catch (clientErr) {
            console.error('PDF error:', clientErr);
            alert('PDF generation failed.');
        } finally {
            setIsGeneratingPdf(false);
        }
    };

    return (
        <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
            className="max-w-6xl mx-auto px-4 py-8 relative min-h-screen pb-20 font-sans selection:bg-[#10b981]/30 text-[var(--text-main)] transition-colors duration-300"
        >
            {/* Maintenance Mode Overlay */}
            <AnimatePresence>
                {appConfig.maintenanceMode && (
                    <motion.div 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-[200] bg-[var(--bg-main)] backdrop-blur-3xl flex flex-col items-center justify-center p-8 text-center"
                    >
                        <div className="bg-[var(--bg-card)] p-12 rounded-3xl border-2 border-[var(--border-subtle)] shadow-2xl max-w-lg space-y-8">
                            <div className="inline-flex p-5 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-amber-500">
                                <AlertTriangle className="w-12 h-12" />
                            </div>
                            <div className="space-y-4">
                                <h2 className="text-4xl font-black text-[var(--text-main)] uppercase tracking-tighter">Under <span className="text-[#10b981]">Maintenance</span></h2>
                                <p className="text-[var(--text-muted)] font-medium leading-relaxed">
                                    {appConfig.alertMessage || "Our neural processing units are currently undergoing scheduled synchronization. We will be back online shortly."}
                                </p>
                            </div>
                            <div className="pt-8 border-t border-[var(--border-subtle)]">
                                <p className="text-[10px] font-black uppercase tracking-[0.3em] text-[#10b981]">Status: Recalibrating Systems</p>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Fullscreen Results Overlay */}
            <AnimatePresence>
                {showResultsOverlay && (
                    <AnalysisReport 
                        results={analysisResults}
                        improvedResume={improvedResume}
                        onDownloadPdf={downloadPdf}
                        onDownloadTxt={downloadTxt}
                        onOptimize={generateImprovement}
                        isOptimizing={isGeneratingImprovement}
                        onClose={() => setShowResultsOverlay(false)}
                        onVerify={() => setIsHireModalOpen(true)}
                        config={appConfig}
                    />
                )}
                {isGeneratingPdf && (
                    <motion.div 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-[100] bg-[var(--bg-main)]/90 backdrop-blur-md flex flex-col items-center justify-center gap-6"
                    >
                        <div className="relative">
                            <div className="absolute inset-0 bg-[#10b981]/20 blur-3xl rounded-full"></div>
                            <Loader2 className="w-16 h-16 text-[#10b981] animate-spin relative z-10" />
                        </div>
                        <div className="text-center space-y-2 relative z-10">
                            <h3 className="text-2xl font-black text-[var(--text-main)] uppercase tracking-tighter">
                                Generating <span className="text-[#10b981]">PDF Report</span>
                            </h3>
                            <p className="text-[var(--text-muted)] text-sm font-medium tracking-wide">
                                Capturing DOM snapshot and rendering static assets...
                            </p>
                            <div className="flex justify-center gap-1 mt-4">
                                <motion.div animate={{ scale: [1, 1.5, 1] }} transition={{ repeat: Infinity, duration: 1 }} className="w-1.5 h-1.5 bg-[#10b981] rounded-full"></motion.div>
                                <motion.div animate={{ scale: [1, 1.5, 1] }} transition={{ repeat: Infinity, duration: 1, delay: 0.2 }} className="w-1.5 h-1.5 bg-[#10b981] rounded-full"></motion.div>
                                <motion.div animate={{ scale: [1, 1.5, 1] }} transition={{ repeat: Infinity, duration: 1, delay: 0.4 }} className="w-1.5 h-1.5 bg-[#10b981] rounded-full"></motion.div>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Main Header */}
                        <header className="text-center mb-10 sm:mb-16 relative z-10 pt-12 sm:pt-20">
                                <div className="flex justify-center mb-6 transition-colors duration-300">
                                    <div className="bg-[var(--bg-card)] p-3 rounded-2xl border-2 border-[var(--border-subtle)] shadow-2xl transition-colors duration-300">
                                        <FileSearch className="w-10 h-10 sm:w-12 sm:h-12 text-[#10b981]" />
                                    </div>
                                </div>
                                <h1 className="text-4xl sm:text-5xl lg:text-7xl font-extrabold text-[var(--text-main)] font-display tracking-tight leading-none mb-6 mt-4 transition-colors duration-300 uppercase">
                                    ATS<span className="text-[#10b981]">MASTER</span>
                                </h1>
                                <div className="flex items-center justify-center gap-3">
                                    <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded bg-[var(--bg-card)] border border-[var(--border-subtle)] text-[#10b981] text-[10px] font-bold uppercase tracking-[0.2em] transition-colors duration-300">
                                        Student Project v1.4
                                    </div>
                                </div>
                                {/* Privacy Alert */}
                                <div className="mt-8 max-w-xl mx-auto p-4 bg-amber-500/5 border border-amber-500/20 rounded-xl flex items-start sm:items-center gap-4 text-left transition-colors duration-300">
                                    <AlertTriangle className="w-5 h-5 text-amber-500 shrink-0 mt-0.5 sm:mt-0" />
                                    <p className="text-[10px] text-[var(--text-muted)] leading-relaxed font-medium transition-colors duration-300">
                                        <span className="font-black text-amber-500 uppercase tracking-widest mr-2">Privacy Check:</span> 
                                        Remove PII (Phone, Address) before processing. Content is processed via SSL protocols using semantic neural models.
                                    </p>
                                </div>
                            </header>

            {/* Input Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 sm:gap-10 mb-12 sm:mb-16">
                <div className="space-y-4">
                    <div className="flex justify-between items-end px-2 mb-2">
                        <div className="space-y-1">
                            <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-[var(--text-muted)] transition-colors duration-300">Source Material</label>
                            <h3 className="text-base sm:text-lg font-bold text-[var(--text-main)] uppercase tracking-tight transition-colors duration-300">Job Requirements</h3>
                        </div>
                        <div className="flex items-center gap-3">
                            {isParsingFiles && <Loader2 className="w-4 h-4 animate-spin text-[#10b981]" />}
                            <label className="group flex items-center gap-2 cursor-pointer text-[10px] font-bold uppercase tracking-widest text-[#10b981] hover:text-emerald-400 transition-all bg-[var(--bg-card)] px-3 sm:px-4 py-2 rounded border border-[var(--border-subtle)]">
                                <Upload className="w-3.5 h-3.5" />
                                <span>Add .txt</span>
                                <input 
                                    type="file" 
                                    className="hidden" 
                                    accept=".txt" 
                                    onChange={(e) => handleFileUpload(e, 'jd')} 
                                    disabled={isParsingFiles}
                                />
                            </label>
                        </div>
                    </div>
                    <textarea 
                        className="w-full h-[350px] sm:h-[450px] p-6 sm:p-8 bg-[var(--bg-card)] border border-[var(--border-subtle)] rounded-2xl focus:ring-4 focus:ring-[#10b981]/5 focus:border-[#10b981]/40 outline-none transition-all resize-none text-[var(--text-main)] text-sm leading-relaxed placeholder:text-[var(--text-muted)]"
                        placeholder="Paste the job description here..."
                        value={jobDescription}
                        onChange={(e) => setJobDescription(e.target.value)}
                    />
                </div>

                <div className="space-y-4">
                    <div className="flex justify-between items-end px-2 mb-2">
                        <div className="space-y-1">
                            <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-[var(--text-muted)] transition-colors duration-300">Your Stats</label>
                            <h3 className="text-base sm:text-lg font-bold text-[var(--text-main)] uppercase tracking-tight transition-colors duration-300">Resume Text</h3>
                        </div>
                        <div className="flex items-center gap-3">
                            {isParsingFiles && <Loader2 className="w-4 h-4 animate-spin text-[#10b981]" />}
                            <label className="group flex items-center gap-2 cursor-pointer text-[10px] font-bold uppercase tracking-widest text-[#10b981] hover:text-emerald-400 transition-all bg-[var(--bg-card)] px-3 sm:px-4 py-2 rounded border border-[var(--border-subtle)]">
                                <Upload className="w-3.5 h-3.5" />
                                <span>Add .txt</span>
                                <input 
                                    type="file" 
                                    className="hidden" 
                                    accept=".txt" 
                                    onChange={(e) => handleFileUpload(e, 'resume')} 
                                    disabled={isParsingFiles}
                                />
                            </label>
                        </div>
                    </div>
                    <textarea 
                        className="w-full h-[350px] sm:h-[450px] p-6 sm:p-8 bg-[var(--bg-card)] border border-[var(--border-subtle)] rounded-2xl focus:ring-4 focus:ring-[#10b981]/5 focus:border-[#10b981]/40 outline-none transition-all resize-none text-[var(--text-main)] text-sm leading-relaxed placeholder:text-[var(--text-muted)]"
                        placeholder="Paste your resume content here..."
                        value={resume}
                        onChange={(e) => setResume(e.target.value)}
                    />
                </div>
            </div>

            {/* Control Panel */}
            <div className="max-w-4xl mx-auto">
                <div className="bg-[var(--bg-card)] backdrop-blur-sm p-8 sm:p-12 rounded-3xl border border-[var(--border-subtle)] relative overflow-hidden transition-colors duration-300">
                    <div className="relative z-10">
                        <div className="flex items-center gap-4 mb-8">
                            <div className="bg-[var(--bg-main)] p-2.5 sm:p-3 rounded-xl border border-[var(--border-subtle)] transition-colors duration-300">
                                <Cpu className="w-5 h-5 sm:w-6 sm:h-6 text-[#10b981]" />
                            </div>
                            <div>
                                <h2 className="text-xl sm:text-2xl font-black text-[var(--text-main)] uppercase tracking-tight font-display transition-colors duration-300">System Settings</h2>
                                <p className="text-[10px] text-[var(--text-muted)] font-bold uppercase tracking-widest leading-none transition-colors duration-300">AI Gateway & Session Security</p>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 sm:gap-10 mb-10 sm:mb-12">
                            <div className={`${analysisResults ? 'md:col-span-3' : 'md:col-span-2'} space-y-6 transition-all duration-500`}>
                                <div className="space-y-3">
                                    <div className="flex justify-between items-center px-1">
                                        <label className="text-[10px] font-black uppercase tracking-[0.2em] text-[var(--text-muted)] transition-colors duration-300">Gemini Pro API Key</label>
                                        <a href="https://aistudio.google.com/app/apikey" target="_blank" rel="noreferrer" className="text-[10px] font-black uppercase tracking-widest text-[#10b981] hover:text-emerald-400">Request Key</a>
                                    </div>
                                    <input 
                                        type="password"
                                        placeholder="Enter your API key..."
                                        className="w-full p-4 sm:p-5 bg-[var(--bg-main)] border border-[var(--border-subtle)] rounded-xl focus:ring-2 focus:ring-[#10b981]/20 focus:border-[#10b981]/50 outline-none transition-all text-[#10b981] font-mono text-sm leading-none"
                                        value={apiKey}
                                        onChange={(e) => setApiKey(e.target.value)}
                                    />
                                </div>
                                <div className="flex flex-wrap items-center gap-6 sm:gap-8 text-[10px] font-black uppercase tracking-[0.2em] text-[var(--text-muted)] transition-colors duration-300">
                                    <label className="flex items-center gap-3 cursor-pointer group hover:text-[#10b981] transition-colors">
                                        <div className="relative flex items-center justify-center">
                                            <input type="checkbox" checked={saveApiKey} onChange={(e) => setSaveApiKey(e.target.checked)} className="peer appearance-none w-4 h-4 rounded border border-[var(--border-subtle)] bg-[var(--bg-main)] checked:bg-[#10b981] checked:border-[#10b981] transition-all cursor-pointer" />
                                            <Check className="w-2.5 h-2.5 text-[#0f172a] absolute opacity-0 peer-checked:opacity-100 transition-opacity pointer-events-none" strokeWidth={5} />
                                        </div>
                                        <span>Save Locally</span>
                                    </label>
                                    <label className="flex items-center gap-3 cursor-pointer group hover:text-[#10b981] transition-colors">
                                        <div className="relative flex items-center justify-center">
                                            <input type="checkbox" checked={useProxy} onChange={(e) => setUseProxy(e.target.checked)} className="peer appearance-none w-4 h-4 rounded border border-[var(--border-subtle)] bg-[var(--bg-main)] checked:bg-[#10b981] checked:border-[#10b981] transition-all cursor-pointer" />
                                            <Check className="w-2.5 h-2.5 text-[#0f172a] absolute opacity-0 peer-checked:opacity-100 transition-opacity pointer-events-none" strokeWidth={5} />
                                        </div>
                                        <span>Cloud Key</span>
                                    </label>
                                    <button onClick={clearApiKey} className="hover:text-red-400 transition-colors flex items-center gap-2 ml-auto">
                                        <X className="w-3 h-3" /> Purge Key
                                    </button>
                                </div>
                            </div>

                            {!analysisResults && (
                                <div className="flex flex-col justify-end">
                                    <button 
                                        onClick={runAnalysis}
                                        disabled={isLoading}
                                        className="group relative w-full h-full bg-[#10b981] hover:bg-emerald-400 disabled:bg-[var(--bg-card)] rounded-2xl p-4 transition-all active:scale-[0.98] shadow-lg"
                                    >
                                        <div className={`h-full w-full rounded-xl border border-[#0f172a]/10 flex flex-col items-center justify-center gap-3 ${isLoading ? 'text-[var(--text-muted)]' : 'text-white'}`}>
                                            {isLoading ? <Loader2 className="w-8 h-8 animate-spin text-[var(--text-muted)]" /> : <Zap className="w-8 h-8 fill-current text-white" />}
                                            <span className="font-extrabold uppercase tracking-[0.2em] text-xs">Analyze Match</span>
                                        </div>
                                    </button>
                                </div>
                            )}
                        </div>

                        {/* Feature Status */}
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-10 border-t border-[var(--border-subtle)] transition-colors duration-300">
                            {[
                                { label: 'Logic', val: 'Semantic', icon: Terminal },
                                { label: 'Engine', val: 'Gemini-2.5', icon: BrainCircuit },
                                { label: 'Privacy', val: 'Client-Side', icon: ShieldCheck },
                                { label: 'License', val: 'MIT-Open', icon: Smartphone },
                            ].map((item, i) => (
                                <div key={i} className="flex flex-col items-center gap-2 p-4 rounded-xl bg-[var(--bg-main)] border border-[var(--border-subtle)] transition-colors duration-300">
                                    <item.icon className="w-4 h-4 text-[#10b981]/50" />
                                    <span className="text-[9px] font-black uppercase text-[var(--text-muted)] tracking-widest leading-none">{item.label}</span>
                                    <span className="text-[10px] font-bold text-[var(--text-main)] uppercase tracking-tighter leading-none transition-colors duration-300">{item.val}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Results Quick Access Button - Appears outside the box once analysis is done */}
                <AnimatePresence>
                    {analysisResults && (
                        <motion.div 
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            className="mt-10 flex justify-center"
                        >
                            <button 
                                onClick={() => setShowResultsOverlay(true)}
                                className="group flex items-center gap-6 bg-[#10b981] hover:bg-emerald-400 text-[#0f172a] px-12 py-6 rounded-2xl font-black uppercase tracking-[0.2em] shadow-[0_30px_60px_-15px_rgba(16,185,129,0.4)] transition-all active:scale-95 border-b-4 border-emerald-700 hover:border-emerald-500"
                            >
                                <BarChart3 className="w-6 h-6" />
                                <span className="text-sm">Analyze Again?</span>
                            </button>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>

            {/* Footer */}
            <footer className="mt-32 text-center pb-20">
                <p className="text-[var(--text-muted)] text-[10px] font-bold uppercase tracking-[0.4em] mb-8 transition-colors duration-300">
                    Open Source  Student Resource Center 
                </p>
                <div className="flex justify-center gap-12 transition-colors duration-300">
                    <button onClick={() => setShowDemoModal(true)} className="text-[var(--text-muted)] hover:text-[#10b981] text-[10px] font-bold uppercase tracking-[0.2em] transition-all flex items-center gap-2 group">
                        <LayoutTemplate className="w-4 h-4 opacity-50 group-hover:opacity-100" /> Gallery
                    </button>
                    <a href="https://github.com/omnox-dev/ATS" target="_blank" className="text-[var(--text-muted)] hover:text-[#10b981] text-[10px] font-bold uppercase tracking-[0.2em] transition-all flex items-center gap-2 group">
                        Source <ExternalLink className="w-4 h-4 opacity-50 group-hover:opacity-100" />
                    </a>
                </div>
            </footer>

            {/* Template Gallery Modal */}
            <AnimatePresence>
                {showDemoModal && (
                    <motion.div 
                        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-[var(--bg-main)]/95 backdrop-blur-md z-[100] flex items-center justify-center p-8 transition-colors duration-300"
                    >
                        <motion.div 
                            initial={{ scale: 0.95, y: 20, opacity: 0 }} animate={{ scale: 1, y: 0, opacity: 1 }} exit={{ scale: 0.95, y: 20, opacity: 0 }}
                            className="bg-[var(--bg-card)] border border-[var(--border-subtle)] rounded-3xl w-full max-w-5xl max-h-[85vh] overflow-hidden flex flex-col relative shadow-2xl p-16 transition-colors duration-300"
                        >
                            <button onClick={() => setShowDemoModal(false)} className="absolute top-8 right-8 text-[var(--text-muted)] hover:text-[var(--text-main)] transition-colors bg-[var(--bg-main)] hover:bg-[#10b981] p-3 rounded z-20 transition-colors duration-300">
                                <X className="w-6 h-6" />
                            </button>
                            <div className="mb-16">
                                <h2 className="text-4xl font-black mb-4 text-[var(--text-main)] font-display uppercase tracking-tight transition-colors duration-300">Template <span className="text-[#10b981]">Archive</span></h2>
                                <p className="text-[var(--text-muted)] font-medium transition-colors duration-300">Verified layouts tested against common legacy parsing systems.</p>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
                                {['The Minimalist', 'Systems Architect', 'The Hybrid'].map((title, i) => (
                                    <div key={i} className="group relative">
                                        <div className="bg-[var(--bg-main)] aspect-[3/4] rounded-2xl overflow-hidden border border-[var(--border-subtle)] group-hover:border-[#10b981]/30 transition-all duration-500 flex items-center justify-center mb-6 transition-colors duration-300">
                                            <FileText className="w-24 h-24 text-[var(--text-muted)] group-hover:text-[#10b981]/20 transition-all duration-700 transition-colors duration-300" />
                                        </div>
                                        <h4 className="font-bold text-[var(--text-main)] uppercase tracking-widest text-xs mb-2 leading-none transition-colors duration-300">{title}</h4>
                                    </div>
                                ))}
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            <HireMeModal 
                isOpen={isHireModalOpen} 
                onClose={() => setIsHireModalOpen(false)} 
                isOccupied={appConfig.isOccupied} 
                serviceFee={appConfig.serviceFee}
                updateFee={appConfig.updateFee}
            />
        </motion.div>
    );
};

export default ATSAnalyzer;
