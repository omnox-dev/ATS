import React, { useState, useEffect } from 'react';
import axios from 'axios';
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
  Check
} from 'lucide-react';

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

const AnalysisReport = ({ results, improvedResume, onDownloadPdf, onDownloadTxt, onOptimize, isOptimizing, onClose }) => {
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
        <div className="max-w-6xl mx-auto px-4 py-12 relative pb-32">
          {/* Top Bar */}
          <div className="flex justify-between items-center mb-12">
            <button 
                onClick={onClose}
                className="flex items-center gap-2 text-[#10b981] text-[10px] font-black uppercase tracking-[0.3em] hover:translate-x-[-4px] transition-all bg-[var(--bg-card)] px-4 py-2 rounded border border-[var(--border-subtle)]"
              >
                <ArrowLeft className="w-3 h-3" /> Back to Workspace
            </button>
            <div className="flex gap-3">
               <button 
                onClick={onDownloadTxt}
                className="flex items-center gap-2 px-6 py-3 bg-[var(--bg-card)] border border-[var(--border-subtle)] rounded text-[10px] uppercase font-black tracking-widest text-[var(--text-muted)] hover:text-[var(--text-main)] transition-all shadow-xl"
              >
                <Download className="w-3.5 h-3.5" /> TXT
              </button>
              <button 
                onClick={onDownloadPdf}
                className="flex items-center gap-2 px-6 py-3 bg-[#10b981] hover:bg-emerald-400 text-white rounded text-[10px] uppercase font-black tracking-widest transition-all shadow-xl"
              >
                <Download className="w-3.5 h-3.5" /> PDF Report
              </button>
            </div>
          </div>

          <div className="mb-16">
            <h2 className="text-5xl lg:text-6xl font-black text-[var(--text-main)] flex items-center gap-6 font-display tracking-tight uppercase transition-colors duration-300">
              Analysis <span className="text-[#10b981]">Suite</span>
            </h2>
            <p className="text-[var(--text-muted)] mt-4 text-sm font-medium tracking-wide max-w-2xl leading-relaxed">
              Our neural engine has decomposed your resume structure and mapped it against the target requirements using semantic alignment protocols.
            </p>
          </div>
  
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
            {/* Match Score Gauge */}
            <div className="bg-[var(--bg-card)] border border-[var(--border-subtle)] p-12 rounded-2xl flex flex-col items-center justify-center relative overflow-hidden backdrop-blur-sm">
              <div className="absolute top-8 left-10">
                <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-[var(--text-muted)]">Sync Ratio</h3>
              </div>
              
              <div className="relative w-64 h-64 mt-4">
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
                    <span className="text-7xl font-black text-[var(--text-main)] font-display tracking-tighter transition-colors duration-300">{score}</span>
                    <span className="text-2xl font-black text-[#10b981]/50 mb-1">%</span>
                  </div>
                  <div className="bg-[var(--bg-main)] px-4 py-1.5 rounded border border-[var(--border-subtle)] mt-4">
                    <span className="text-[9px] uppercase font-black text-[#10b981] tracking-[0.2em]">
                        {score > 80 ? 'Optimized' : score > 50 ? 'Stable' : 'Unstable'}
                    </span>
                  </div>
                </div>
              </div>
            </div>
  
            {/* Peer Benchmarking */}
            <div className="lg:col-span-2 bg-[var(--bg-card)] border border-[var(--border-subtle)] p-12 rounded-2xl backdrop-blur-sm relative overflow-hidden">
               <div className="absolute top-0 right-0 p-12 opacity-[0.02] pointer-events-none text-[var(--text-main)]">
                <BarChart3 className="w-64 h-64" />
              </div>
              
              <div className="flex justify-between items-start mb-12 relative z-10">
                <div className="space-y-2">
                  <h3 className="text-xs font-black uppercase tracking-[0.3em] text-[#10b981]">Competitive Landscape</h3>
                  <p className="text-[var(--text-muted)] text-sm font-medium">Distribution vs Entry-Level Market Avg</p>
                </div>
              </div>
  
              <div className="space-y-10 relative z-10">
                <div className="space-y-4">
                  <div className="flex justify-between items-end">
                    <span className="text-[10px] font-black uppercase tracking-[0.2em] text-[var(--text-muted)]">Technical Skill Overlay</span>
                    <span className="text-lg font-black text-[var(--text-main)] transition-colors duration-300">{score}% Match</span>
                  </div>
                  <div className="h-2 w-full bg-[var(--bg-main)] rounded-full relative overflow-hidden border border-[var(--border-subtle)]">
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
                    <span className="text-[10px] font-black uppercase tracking-[0.2em] text-[var(--text-muted)]">Structural Efficiency</span>
                    <span className="text-lg font-black text-[var(--text-main)] transition-colors duration-300">{parseScore}% Parse</span>
                  </div>
                  <div className="h-2 w-full bg-[var(--bg-main)] rounded-full relative overflow-hidden border border-[var(--border-subtle)]">
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
  
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Logic Checks */}
            <div className="bg-[var(--bg-card)] border border-[var(--border-subtle)] rounded-2xl p-12 relative overflow-hidden backdrop-blur-sm">
              <h3 className="text-xl font-black text-[var(--text-main)] mb-10 flex items-center gap-4 uppercase tracking-tight transition-colors duration-300">
                <Target className="text-[#10b981] w-6 h-6 border-2 border-[var(--border-subtle)] p-1 rounded" />
                Keyword Mapping
              </h3>
              
              <div className="space-y-10">
                <div className="space-y-4">
                  <p className="text-[10px] font-black text-red-400/50 uppercase tracking-[0.3em]">Critical Gaps identified</p>
                  <div className="flex flex-wrap gap-3">
                    {(results?.weaknesses || []).map((skill, i) => (
                      <div key={i} className="flex items-center gap-2 px-4 py-2 bg-red-400/5 border border-red-500/20 rounded hover:bg-red-500/10 transition-all">
                        <AlertCircle className="w-3.5 h-3.5 text-red-500" />
                        <span className="text-[10px] font-bold text-[var(--text-muted)] uppercase tracking-wide transition-colors duration-300">{skill}</span>
                      </div>
                    ))}
                  </div>
                </div>
                
                <div className="pt-10 border-t border-[var(--border-subtle)] space-y-4">
                   <p className="text-[10px] font-black text-[#10b981]/50 uppercase tracking-[0.3em]">Core Competencies found</p>
                   <div className="flex flex-wrap gap-3">
                    {(results?.strengths || []).map((skill, i) => (
                      <div key={i} className="flex items-center gap-2 px-4 py-2 bg-[#10b981]/5 border border-[#10b981]/20 rounded hover:bg-[#10b981]/10 transition-all">
                        <CheckCircle className="w-3.5 h-3.5 text-[#10b981]" />
                        <span className="text-[10px] font-bold text-[var(--text-muted)] uppercase tracking-wide transition-colors duration-300">{skill}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
  
            {/* Analysis Summary */}
            <div className="bg-[var(--bg-card)] border border-[var(--border-subtle)] rounded-2xl p-12 backdrop-blur-sm relative overflow-hidden flex flex-col self-start">
              <div className="mb-8">
                  <div className="bg-[var(--bg-main)] w-fit p-3 rounded-xl mb-6 border border-[var(--border-subtle)]">
                    <BrainCircuit className="text-[#10b981] w-8 h-8" />
                  </div>
                  <h3 className="text-2xl font-black text-[var(--text-main)] uppercase tracking-tight mb-4 font-display transition-colors duration-300">Neural Overview</h3>
                  <div className="text-[var(--text-muted)] text-lg leading-relaxed font-medium whitespace-pre-wrap transition-colors duration-300">
                    {results?.summary}
                  </div>
              </div>
              
              <div className="pt-10 border-t border-[var(--border-subtle)]">
                <button 
                    onClick={onOptimize}
                    disabled={isOptimizing}
                    className="w-full py-5 bg-[#10b981] hover:bg-emerald-400 disabled:bg-[var(--bg-card)] rounded font-black text-white uppercase tracking-[0.2em] text-xs transition-all flex items-center justify-center gap-4 group shadow-lg"
                >
                    {isOptimizing ? <Loader2 className="w-5 h-5 animate-spin" /> : <Zap className="w-5 h-5 fill-current group-hover:scale-110 transition-transform" />}
                    {isOptimizing ? 'Recalibrating Context...' : 'Optimize Content'}
                </button>
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
    const [showDemoModal, setShowDemoModal] = useState(false);

    // Clear results when input changes
    useEffect(() => {
        if (analysisResults) {
            setAnalysisResults(null);
            setImprovedResume('');
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

        const payload = {
            contents: [{ role: "user", parts: [{ text: `JD:\n${jobDescription}\n\nResume:\n${resume}` }] }],
            systemInstruction: { parts: [{ text: SYSTEM_PROMPT }] },
            generationConfig: {
                responseMimeType: "application/json",
                responseSchema: JSON_SCHEMA,
            }
        };

        const apiUrl = useProxy ? '/api/generate' : `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=${apiKey}`;

        try {
            const response = await axios.post(apiUrl, payload);
            const data = response.data;
            const text = data.candidates?.[0]?.content?.parts?.[0]?.text;
            if (text) {
                setAnalysisResults(JSON.parse(text));
                setShowResultsOverlay(true);
                setImprovedResume('');
            }
        } catch (error) {
            console.error('Analysis error:', error);
            const status = error.response?.status;
            const errMsg = error.response?.data?.error?.message || error.message || '';
            
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
        const prompt = `Rewrite the resume to address missing keywords while maintaining accuracy. JD: ${jobDescription}. Gaps: ${(analysisResults?.weaknesses || []).join(', ')}. Resume: ${resume}.`;
        
        const payload = {
            contents: [{ role: 'user', parts: [{ text: prompt }] }],
            systemInstruction: { parts: [{ text: 'Professional resume optimizer.' }] },
            generationConfig: { responseMimeType: 'text/plain' }
        };

        const apiUrl = useProxy ? '/api/generate' : `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=${apiKey}`;

        try {
            const response = await axios.post(apiUrl, payload);
            const text = response.data.candidates?.[0]?.content?.parts?.[0]?.text;
            setImprovedResume(text);
        } catch (error) {
            const status = error.response?.status;
            const errMsg = error.response?.data?.error?.message || error.message || '';
            
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
        if (!useProxy) {
            alert('Enable "PDF Render Proxy" in the configuration to generate PDF files.');
            return;
        }
        try {
            const html = `<html><body><h1>Resume Intelligence</h1><pre>${improvedResume || JSON.stringify(analysisResults, null, 2)}</pre></body></html>`;
            const resp = await axios.post('/api/render-pdf', { html }, { responseType: 'blob' });
            const url = URL.createObjectURL(new Blob([resp.data], { type: 'application/pdf' }));
            const a = document.createElement('a');
            a.href = url;
            a.download = 'ats_report.pdf';
            a.click();
        } catch (e) {
            alert('PDF creation failed.');
        }
    };

    return (
        <div className="max-w-6xl mx-auto px-4 py-8 relative min-h-screen pb-20 font-sans selection:bg-[#10b981]/30 text-[var(--text-main)] transition-colors duration-300">
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
                    />
                )}
            </AnimatePresence>

            {/* Main Header */}
                        <header className="text-center mb-16 relative z-10 pt-12">
                                <div className="flex justify-center mb-6">
                                    <div className="bg-[var(--bg-card)] p-3 rounded-2xl border-2 border-[var(--border-subtle)] shadow-2xl">
                                        <FileSearch className="w-12 h-12 text-[#10b981]" />
                                    </div>
                                </div>
                                <h1 className="text-5xl lg:text-7xl font-extrabold text-[var(--text-main)] font-display tracking-tight leading-none mb-6 mt-4 transition-colors duration-300">
                                    ATS<span className="text-[#10b981]">MASTER</span>
                                </h1>
                <div className="flex items-center justify-center gap-3">
                    <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded bg-[var(--bg-card)] border border-[var(--border-subtle)] text-[#10b981] text-[10px] font-bold uppercase tracking-[0.2em]">
                        Student Project v1.4
                    </div>
                </div>
            </header>

            {/* Input Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 mb-16">
                <div className="space-y-4">
                    <div className="flex justify-between items-end px-2 mb-2">
                        <div className="space-y-1">
                            <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-[var(--text-muted)]">Source Material</label>
                            <h3 className="text-lg font-bold text-[var(--text-main)] uppercase tracking-tight transition-colors duration-300">Job Requirements</h3>
                        </div>
                        <div className="flex items-center gap-3">
                            {isParsingFiles && <Loader2 className="w-4 h-4 animate-spin text-[#10b981]" />}
                            <label className="group flex items-center gap-2 cursor-pointer text-[10px] font-bold uppercase tracking-widest text-[#10b981] hover:text-emerald-400 transition-all bg-[var(--bg-card)] px-4 py-2 rounded border border-[var(--border-subtle)]">
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
                        className="w-full h-[450px] p-8 bg-[var(--bg-card)] border border-[var(--border-subtle)] rounded-2xl focus:ring-4 focus:ring-[#10b981]/5 focus:border-[#10b981]/40 outline-none transition-all resize-none text-[var(--text-main)] text-sm leading-relaxed placeholder:text-[var(--text-muted)]"
                        placeholder="Paste the job description here..."
                        value={jobDescription}
                        onChange={(e) => setJobDescription(e.target.value)}
                    />
                </div>

                <div className="space-y-4">
                    <div className="flex justify-between items-end px-2 mb-2">
                        <div className="space-y-1">
                            <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-[var(--text-muted)]">Your Stats</label>
                            <h3 className="text-lg font-bold text-[var(--text-main)] uppercase tracking-tight transition-colors duration-300">Resume Text</h3>
                        </div>
                        <div className="flex items-center gap-3">
                            {isParsingFiles && <Loader2 className="w-4 h-4 animate-spin text-[#10b981]" />}
                            <label className="group flex items-center gap-2 cursor-pointer text-[10px] font-bold uppercase tracking-widest text-[#10b981] hover:text-emerald-400 transition-all bg-[var(--bg-card)] px-4 py-2 rounded border border-[var(--border-subtle)]">
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
                        className="w-full h-[450px] p-8 bg-[var(--bg-card)] border border-[var(--border-subtle)] rounded-2xl focus:ring-4 focus:ring-[#10b981]/5 focus:border-[#10b981]/40 outline-none transition-all resize-none text-[var(--text-main)] text-sm leading-relaxed placeholder:text-[var(--text-muted)]"
                        placeholder="Paste your resume content here..."
                        value={resume}
                        onChange={(e) => setResume(e.target.value)}
                    />
                </div>
            </div>

            {/* Control Panel */}
            <div className="max-w-4xl mx-auto">
                <div className="bg-[var(--bg-card)] backdrop-blur-sm p-12 rounded-2xl border border-[var(--border-subtle)] relative overflow-hidden transition-colors duration-300">
                    <div className="relative z-10">
                        <div className="flex items-center gap-4 mb-8">
                            <div className="bg-[var(--bg-main)] p-3 rounded border border-[var(--border-subtle)] transition-colors duration-300">
                                <Cpu className="w-6 h-6 text-[#10b981]" />
                            </div>
                            <div>
                                <h2 className="text-2xl font-black text-[var(--text-main)] uppercase tracking-tight font-display transition-colors duration-300">System Settings</h2>
                                <p className="text-[10px] text-[var(--text-muted)] font-bold uppercase tracking-widest leading-none transition-colors duration-300">AI Gateway & Session Security</p>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 mb-12">
                            <div className={`${analysisResults ? 'md:col-span-3' : 'md:col-span-2'} space-y-6 transition-all duration-500`}>
                                <div className="space-y-3">
                                    <div className="flex justify-between items-center px-1">
                                        <label className="text-[10px] font-black uppercase tracking-[0.2em] text-[var(--text-muted)]">Gemini Pro API Key</label>
                                        <a href="https://aistudio.google.com/app/apikey" target="_blank" rel="noreferrer" className="text-[10px] font-black uppercase tracking-widest text-[#10b981] hover:text-emerald-400">Request Key</a>
                                    </div>
                                    <input 
                                        type="password"
                                        placeholder="Enter your API key..."
                                        className="w-full p-5 bg-[var(--bg-main)] border border-[var(--border-subtle)] rounded-xl focus:ring-2 focus:ring-[#10b981]/20 focus:border-[#10b981]/50 outline-none transition-all text-[#10b981] font-mono text-sm leading-none"
                                        value={apiKey}
                                        onChange={(e) => setApiKey(e.target.value)}
                                    />
                                </div>
                                <div className="flex flex-wrap items-center gap-8 text-[10px] font-black uppercase tracking-[0.2em] text-[var(--text-muted)] transition-colors duration-300">
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
                                        <span>PDF Proxy</span>
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
                                        className="group relative w-full h-full bg-[#10b981] hover:bg-emerald-400 disabled:bg-[var(--bg-card)] disabled:text-[var(--text-muted)] rounded-2xl p-4 transition-all active:scale-[0.98] shadow-lg"
                                    >
                                        <div className="h-full w-full rounded-xl border border-[#0f172a]/10 flex flex-col items-center justify-center gap-3 text-white">
                                            {isLoading ? <Loader2 className="w-8 h-8 animate-spin" /> : <Zap className="w-8 h-8 fill-current" />}
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
                                { label: 'Engine', val: 'Gemini-1.5', icon: BrainCircuit },
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
        </div>
    );
};

export default ATSAnalyzer;
