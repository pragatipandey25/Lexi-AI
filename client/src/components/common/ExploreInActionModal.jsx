import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  X,
  Sparkles,
  FileSearch,
  AlertTriangle,
  MessageSquare,
  Languages,
  Tags,
  Calendar,
  GitCompare,
  FileDown,
  ArrowRight,
  CheckCircle2,
  Quote,
  ShieldAlert,
  Bot,
  User,
  Clock,
  Download,
  ExternalLink,
  Loader2,
  Check,
  ChevronRight,
  Layers,
  BookOpen,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import api from '../../services/api';

export const ExploreInActionModal = ({ isOpen, onClose, initialModuleId = 'smart_processing' }) => {
  const navigate = useNavigate();
  const { user, login } = useAuth();
  const [activeModule, setActiveModule] = useState(initialModuleId);
  const [loadingDemoLaunch, setLoadingDemoLaunch] = useState(false);

  // Sub-feature interactive states
  // Module 3 Risk filters
  const [riskFilter, setRiskFilter] = useState('all');
  // Module 4 Chat mock interactive state
  const [chatMessages, setChatMessages] = useState([
    {
      role: 'assistant',
      content:
        'Hello! I have fully processed "Commercial_Lease_Agreement.pdf". You can ask any question about notice periods, indemnities, rent schedules, or termination rights.',
      sources: [],
    },
  ]);
  const [chatInput, setChatInput] = useState('');
  // Module 5 Language toggle
  const [bilingualLang, setBilingualLang] = useState('hi');
  // Module 6 Clause category filter
  const [selectedCategory, setSelectedCategory] = useState('Liability and Indemnity');
  // Module 7 Obligations interactive toggle
  const [obligationsList, setObligationsList] = useState([
    {
      id: 1,
      title: 'Pay Initial Security Deposit',
      party: 'Tenant (Beta Labs)',
      due: 'Within 30 Days of Execution',
      status: 'Pending',
      priority: 'High',
    },
    {
      id: 2,
      title: 'Structural HVAC Pre-Inspection',
      party: 'Landlord (Acme Corp)',
      due: 'Prior to Possession Date',
      status: 'Completed',
      priority: 'Medium',
    },
    {
      id: 3,
      title: 'Provide Comprehensive General Liability Insurance',
      party: 'Tenant (Beta Labs)',
      due: 'Annually on 1st April',
      status: 'Pending',
      priority: 'High',
    },
  ]);

  if (!isOpen) return null;

  const modules = [
    { id: 'smart_processing', title: 'Smart Processing', icon: FileSearch, badge: 'PDF + OCR' },
    { id: 'legal_analysis', title: 'AI Legal Analysis', icon: Sparkles, badge: 'Gemini 3 Flash' },
    { id: 'risk_scanner', title: 'Risk & Suspicious', icon: AlertTriangle, badge: 'Dual-Engine' },
    { id: 'document_chat', title: 'Document Chat', icon: MessageSquare, badge: 'Grounded Q&A' },
    { id: 'bilingual_explanations', title: 'English & Hindi', icon: Languages, badge: 'Bilingual' },
    { id: 'clause_categorization', title: 'Categorization', icon: Tags, badge: '11 Domains' },
    { id: 'obligations_tracker', title: 'Deadlines Tracker', icon: Calendar, badge: 'Timeline' },
    { id: 'document_comparison', title: 'Doc Comparison', icon: GitCompare, badge: 'Diff Matrix' },
    { id: 'downloadable_report', title: 'Audit Report', icon: FileDown, badge: 'PDF Export' },
  ];

  // 1-Click Launch Demo Workspace
  const handleLaunchFullWorkspace = async () => {
    setLoadingDemoLaunch(true);
    try {
      if (!user) {
        await login('demo@lexiai.org', 'lexiai123');
      }
      // Load sample contract dynamically into MongoDB
      const res = await api.post('/documents/load-sample');
      if (res.data?.success && res.data.data?._id) {
        onClose();
        navigate(`/documents/${res.data.data._id}`);
      } else {
        onClose();
        navigate('/dashboard');
      }
    } catch (err) {
      console.error('Failed to launch demo workspace:', err);
      onClose();
      navigate('/login');
    } finally {
      setLoadingDemoLaunch(false);
    }
  };

  // Chat interaction simulation
  const handleSendChatPrompt = (promptText) => {
    const q = promptText || chatInput;
    if (!q.trim()) return;

    const userMsg = { role: 'user', content: q.trim(), sources: [] };
    let assistantMsg = {
      role: 'assistant',
      content:
        'Under Clause 12.1, either party may terminate this lease without penalty by providing at least 90 calendar days prior written notice. If Tenant vacates prior to the 24-month lock-in period, the full remaining lock-in rent remains payable as liquidated damages.',
      sources: [
        {
          clauseTitle: 'Clause 12.1 — Termination Notice & Early Exit Penalty',
          citation:
            'Either party may terminate this agreement upon ninety (90) days written notice... early termination prior to month 24 forfeits security deposit and accelerates rent.',
        },
      ],
    };

    if (q.toLowerCase().includes('delayed') || q.toLowerCase().includes('rent')) {
      assistantMsg = {
        role: 'assistant',
        content:
          'Pursuant to Clause 4.3, monthly rent is due on or before the 5th of each calendar month. A grace period of 5 calendar days is permitted. Thereafter, delayed payments incur an interest charge of 18% per annum compounded monthly.',
        sources: [
          {
            clauseTitle: 'Clause 4.3 — Late Payment Penalties',
            citation:
              'Failure to pay base rent by the 10th day shall incur an automatic 18% per annum penalty fee.',
          },
        ],
      };
    } else if (q.toLowerCase().includes('indemnity') || q.toLowerCase().includes('liability')) {
      assistantMsg = {
        role: 'assistant',
        content:
          'Clause 14.2 contains a one-sided indemnity: Tenant indemnifies Landlord against all claims, damage, or third-party lawsuits, including those caused by Landlord\'s own negligence. This is flagged as a High Severity legal risk.',
        sources: [
          {
            clauseTitle: 'Clause 14.2 — Comprehensive Indemnification',
            citation:
              'Tenant agrees to defend, indemnify, and hold harmless Landlord against any and all claims, liabilities, or losses whatsoever.',
          },
        ],
      };
    }

    setChatMessages((prev) => [...prev, userMsg, assistantMsg]);
    setChatInput('');
  };

  const toggleObligation = (id) => {
    setObligationsList((prev) =>
      prev.map((o) =>
        o.id === id ? { ...o, status: o.status === 'Completed' ? 'Pending' : 'Completed' } : o
      )
    );
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 md:p-6 overflow-y-auto bg-slate-950/70 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-5xl bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[92vh]">
        {/* Modal Top Bar */}
        <div className="px-6 py-4 bg-slate-900 text-white flex items-center justify-between border-b border-slate-800">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 rounded-xl bg-brand-500/20 text-brand-400 flex items-center justify-center">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-white flex items-center space-x-2">
                <span>Features Workshop</span>
                <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded bg-brand-500/30 text-brand-300 font-semibold">
                  Interactive Suite
                </span>
              </h2>
              <p className="text-xs text-slate-400">
                Hands-on workshop exploring real AI engine outputs on a 14-page Commercial Property Lease
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            <button
              onClick={handleLaunchFullWorkspace}
              disabled={loadingDemoLaunch}
              className="hidden sm:inline-flex items-center space-x-1.5 px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-brand-600 to-indigo-600 hover:from-brand-700 hover:to-indigo-700 text-white text-xs font-semibold shadow-md transition-all hover:scale-105"
            >
              {loadingDemoLaunch ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  <span>Loading Workspace...</span>
                </>
              ) : (
                <>
                  <span>Open Full Workspace</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </>
              )}
            </button>

            <button
              onClick={onClose}
              className="p-1.5 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Module Selector Ribbon */}
        <div className="px-6 py-2.5 bg-slate-50 border-b border-slate-200 overflow-x-auto flex items-center space-x-2 scrollbar-none">
          {modules.map((m) => {
            const Icon = m.icon;
            const isActive = activeModule === m.id;
            return (
              <button
                key={m.id}
                onClick={() => setActiveModule(m.id)}
                className={`px-3 py-1.5 rounded-xl text-xs font-medium whitespace-nowrap flex items-center space-x-1.5 transition-all ${
                  isActive
                    ? 'bg-brand-600 text-white font-semibold shadow-sm'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{m.title}</span>
              </button>
            );
          })}
        </div>

        {/* Modal Main Interactive Body */}
        <div className="flex-1 p-6 overflow-y-auto space-y-6 bg-slate-50/50">
          {/* MODULE 1: SMART DOCUMENT PROCESSING */}
          {activeModule === 'smart_processing' && (
            <div className="space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div>
                  <h3 className="text-base font-bold text-slate-900">
                    Smart PDF & OCR Text Extraction Engine
                  </h3>
                  <p className="text-xs text-slate-500">
                    Extracts raw text, detects tables, and runs Tesseract OCR fallback for scanned pages.
                  </p>
                </div>
                <span className="text-xs font-mono px-2.5 py-1 rounded-lg bg-emerald-100 text-emerald-800 font-semibold self-start sm:self-auto">
                  Extraction Quality: 99.4% (Native Digital)
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="p-4 bg-white rounded-2xl border border-slate-200 shadow-sm space-y-2">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                    Pages Processed
                  </span>
                  <p className="text-2xl font-extrabold text-slate-900">14 Pages</p>
                  <p className="text-[11px] text-slate-500">Structured layout segmented into 28 legal sections.</p>
                </div>

                <div className="p-4 bg-white rounded-2xl border border-slate-200 shadow-sm space-y-2">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                    Corpus Token Volume
                  </span>
                  <p className="text-2xl font-extrabold text-brand-600">4,820 Words</p>
                  <p className="text-[11px] text-slate-500">Parsed in 340ms via clean memory buffer stream.</p>
                </div>

                <div className="p-4 bg-white rounded-2xl border border-slate-200 shadow-sm space-y-2">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                    Fallback Pipeline
                  </span>
                  <p className="text-2xl font-extrabold text-indigo-600">OCR Ready</p>
                  <p className="text-[11px] text-slate-500">Tesseract eng workers handle scanned clauses & stamps.</p>
                </div>
              </div>

              <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-sm space-y-2">
                <div className="flex items-center justify-between text-xs font-mono text-slate-500 pb-2 border-b border-slate-100">
                  <span className="font-semibold text-slate-800">Raw Extraction Buffer Excerpt</span>
                  <span>Character Offset: 0 - 640</span>
                </div>
                <pre className="text-[11px] font-mono text-slate-700 bg-slate-900 text-slate-200 p-4 rounded-xl overflow-x-auto whitespace-pre-wrap leading-relaxed">
{`COMMERCIAL PROPERTY LEASE AGREEMENT
THIS INDENTURE OF LEASE is executed on this 15th day of November, 2024 at Mumbai, Maharashtra
BETWEEN:
ACME REAL ESTATE INFRASTRUCTURE LTD (hereinafter referred to as the "Lessor/Landlord")
AND
BETA LABS PRIVATE LIMITED (hereinafter referred to as the "Lessee/Tenant")

WHEREAS the Lessor is absolute owner of Office Unit #402, Quantum Towers, BKC, Mumbai (3,200 sq.ft)...`}
                </pre>
              </div>
            </div>
          )}

          {/* MODULE 2: AI LEGAL ANALYSIS */}
          {activeModule === 'legal_analysis' && (
            <div className="space-y-4">
              <div className="bg-gradient-to-br from-slate-900 to-indigo-950 text-white p-6 rounded-3xl shadow-lg space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono font-bold px-3 py-1 rounded-full bg-brand-500/20 text-brand-300 border border-brand-500/30 uppercase">
                    Commercial Lease Agreement
                  </span>
                  <span className="text-xs text-slate-400 font-mono">Gemini 3 Flash</span>
                </div>
                <h3 className="text-base font-bold text-white">Executive AI Contract Assessment</h3>
                <p className="text-xs text-slate-300 leading-relaxed">
                  A 36-month commercial property lease for 3,200 sq.ft commercial office space in BKC, Mumbai. The contract sets an initial monthly rent of ₹1,50,000 with a 10% annual escalation. While operational terms are standard, it contains stringent lock-in penalties and one-sided indemnification in favor of the Landlord.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-2">
                  <h4 className="font-bold text-xs uppercase tracking-wider text-brand-600">
                    Tenant Responsibilities (Beta Labs)
                  </h4>
                  <ul className="text-xs text-slate-700 space-y-1.5">
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                      <span>Maintain interior premises and HVAC equipment in good condition.</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                      <span>Deposit ₹4,50,000 security deposit within 30 days of execution.</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                      <span>Obtain comprehensive general liability insurance of ₹2,00,00,000.</span>
                    </li>
                  </ul>
                </div>

                <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-2">
                  <h4 className="font-bold text-xs uppercase tracking-wider text-indigo-600">
                    Landlord Responsibilities (Acme Corp)
                  </h4>
                  <ul className="text-xs text-slate-700 space-y-1.5">
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                      <span>Maintain external structural walls, roofs, and shared utility connections.</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                      <span>Guarantee peaceful and quiet possession free from third-party encumbrances.</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                      <span>Refund security deposit within 30 business days of lease expiration.</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          )}

          {/* MODULE 3: RISK & SUSPICIOUS SCANNER */}
          {activeModule === 'risk_scanner' && (
            <div className="space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <h3 className="text-base font-bold text-slate-900">
                    Dual Risk & Suspicious Anomaly Scanner
                  </h3>
                  <p className="text-xs text-slate-500">
                    Separates substantive legal liabilities from drafting contradictions and anomalies.
                  </p>
                </div>

                <div className="flex items-center space-x-1.5 bg-white p-1 rounded-xl border border-slate-200">
                  {['all', 'high', 'suspicious'].map((f) => (
                    <button
                      key={f}
                      onClick={() => setRiskFilter(f)}
                      className={`px-3 py-1 rounded-lg text-xs font-semibold capitalize transition-all ${
                        riskFilter === f
                          ? 'bg-slate-900 text-white'
                          : 'text-slate-600 hover:bg-slate-100'
                      }`}
                    >
                      {f}
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-3">
                {(riskFilter === 'all' || riskFilter === 'high') && (
                  <div className="bg-white rounded-2xl border border-red-200 p-5 shadow-sm space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <span className="px-2 py-0.5 rounded bg-red-100 text-red-700 text-[10px] font-bold uppercase">
                          High Severity Legal Risk
                        </span>
                        <h4 className="font-bold text-xs text-slate-900">
                          Unilateral Indemnification for Landlord Gross Negligence
                        </h4>
                      </div>
                      <span className="text-[11px] font-mono text-slate-500">Clause 14.2 (Page 9)</span>
                    </div>

                    <div className="p-3 bg-red-50/50 rounded-xl border border-red-100 text-[11px] font-mono text-slate-800 italic">
                      &quot;Tenant agrees to indemnify and hold Landlord harmless against any and all claims, liabilities, or damages, regardless of whether caused by Landlord&apos;s own acts or omissions.&quot;
                    </div>

                    <p className="text-xs text-slate-600">
                      <strong>Why this matters:</strong> This forces the tenant to assume legal financial liability even if the landlord&apos;s own staff damages property or causes injury.
                    </p>

                    <div className="p-2.5 bg-brand-50 rounded-xl text-xs text-brand-900 font-medium">
                      <strong>Recommended Action:</strong> Insert standard mutual carve-out: &quot;except to the extent caused by the Landlord&apos;s gross negligence or willful misconduct.&quot;
                    </div>
                  </div>
                )}

                {(riskFilter === 'all' || riskFilter === 'suspicious') && (
                  <div className="bg-white rounded-2xl border border-purple-200 p-5 shadow-sm space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <span className="px-2 py-0.5 rounded bg-purple-100 text-purple-700 text-[10px] font-bold uppercase">
                          Suspicious Drafting Anomaly
                        </span>
                        <h4 className="font-bold text-xs text-slate-900">
                          Conflicting Execution Dates & Missing Annexure B
                        </h4>
                      </div>
                      <span className="text-[11px] font-mono text-slate-500">Page 1 vs Page 13</span>
                    </div>

                    <p className="text-xs text-slate-600">
                      The agreement preamble specifies execution on <strong>15th November 2024</strong>, while the signature block states <strong>1st December 2024</strong>. Furthermore, Clause 3.2 references &quot;List of Fixtures in Annexure B&quot;, but Annexure B is omitted from the document bundle.
                    </p>

                    <div className="p-2.5 bg-purple-50 rounded-xl text-xs text-purple-900 font-medium">
                      <strong>Recommended Action:</strong> Reconcile execution dates and request Landlord to attach the signed Annexure B inventory list prior to execution.
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* MODULE 4: AI DOCUMENT CHAT */}
          {activeModule === 'document_chat' && (
            <div className="space-y-4">
              <div>
                <h3 className="text-base font-bold text-slate-900">
                  Evidence-Grounded AI Document Chat
                </h3>
                <p className="text-xs text-slate-500">
                  Ask questions in natural language. Every answer is grounded in exact clause citations.
                </p>
              </div>

              {/* Chat Window */}
              <div className="bg-white rounded-2xl border border-slate-200 shadow-sm flex flex-col h-[400px] overflow-hidden">
                <div className="flex-1 p-4 overflow-y-auto space-y-3">
                  {chatMessages.map((msg, idx) => (
                    <div
                      key={idx}
                      className={`flex items-start space-x-2.5 ${
                        msg.role === 'user' ? 'flex-row-reverse space-x-reverse' : ''
                      }`}
                    >
                      <div
                        className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 text-xs ${
                          msg.role === 'user' ? 'bg-slate-900 text-white' : 'bg-brand-600 text-white'
                        }`}
                      >
                        {msg.role === 'user' ? <User className="w-3.5 h-3.5" /> : <Bot className="w-3.5 h-3.5" />}
                      </div>

                      <div
                        className={`max-w-[85%] p-3.5 rounded-2xl text-xs leading-relaxed space-y-2 ${
                          msg.role === 'user'
                            ? 'bg-slate-900 text-white'
                            : 'bg-slate-50 border border-slate-200 text-slate-800'
                        }`}
                      >
                        <p>{msg.content}</p>
                        {msg.sources?.length > 0 && (
                          <div className="pt-2 border-t border-slate-200 space-y-1">
                            <span className="text-[10px] font-bold text-brand-700 uppercase tracking-wider block">
                              Citations:
                            </span>
                            {msg.sources.map((s, sIdx) => (
                              <div
                                key={sIdx}
                                className="p-2 bg-white rounded-lg border border-slate-200 text-[11px] font-mono text-slate-600"
                              >
                                <p className="font-bold text-slate-800">{s.clauseTitle}</p>
                                <p className="italic text-slate-500">&quot;{s.citation}&quot;</p>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>

                {/* Quick Prompt Chips */}
                <div className="p-2.5 bg-slate-100/70 border-t border-slate-200 flex items-center gap-2 overflow-x-auto">
                  <span className="text-[10px] font-bold uppercase text-slate-400 shrink-0">Try Asking:</span>
                  {[
                    'What is the penalty for early exit?',
                    'What happens if rent is paid late?',
                    'Explain the indemnity risk clause',
                  ].map((chip, idx) => (
                    <button
                      key={idx}
                      onClick={() => handleSendChatPrompt(chip)}
                      className="px-2.5 py-1 bg-white hover:bg-brand-50 hover:text-brand-700 text-slate-700 text-[11px] rounded-lg border border-slate-200 whitespace-nowrap transition-colors"
                    >
                      &quot;{chip}&quot;
                    </button>
                  ))}
                </div>

                {/* Input Bar */}
                <div className="p-3 bg-white border-t border-slate-200 flex items-center gap-2">
                  <input
                    type="text"
                    placeholder="Type a question about this contract..."
                    value={chatInput}
                    onChange={(e) => setChatInput(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleSendChatPrompt()}
                    className="flex-1 px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs outline-none focus:ring-2 focus:ring-brand-500"
                  />
                  <button
                    onClick={() => handleSendChatPrompt()}
                    className="px-4 py-2 bg-brand-600 hover:bg-brand-700 text-white rounded-xl text-xs font-semibold shadow-sm transition-all"
                  >
                    Ask
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* MODULE 5: BILINGUAL EXPLANATIONS */}
          {activeModule === 'bilingual_explanations' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-base font-bold text-slate-900">
                    Bilingual Deconstruction (English & Hindi)
                  </h3>
                  <p className="text-xs text-slate-500">
                    Translates dense legal formulations into accessible vernacular hindi.
                  </p>
                </div>

                <div className="flex items-center space-x-1.5 bg-white p-1 rounded-xl border border-slate-200">
                  <button
                    onClick={() => setBilingualLang('en')}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                      bilingualLang === 'en' ? 'bg-brand-600 text-white' : 'text-slate-600 hover:bg-slate-100'
                    }`}
                  >
                    English
                  </button>
                  <button
                    onClick={() => setBilingualLang('hi')}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                      bilingualLang === 'hi' ? 'bg-brand-600 text-white' : 'text-slate-600 hover:bg-slate-100'
                    }`}
                  >
                    हिंदी व्याख्या
                  </button>
                </div>
              </div>

              <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm space-y-3">
                <span className="text-[11px] font-bold uppercase tracking-wider text-brand-600">
                  {bilingualLang === 'hi' ? 'सरल हिंदी में अनुबंध सारांश' : 'Simplified English Overview'}
                </span>
                <p className="text-xs sm:text-sm text-slate-800 leading-relaxed bg-slate-50 p-4 rounded-xl border border-slate-100 whitespace-pre-wrap">
                  {bilingualLang === 'hi'
                    ? `यह एक 36 महीने की कमर्शियल लीज है जिसके तहत किरायेदार (Beta Labs) को हर महीने ₹1,50,000 किराया देना होगा। हर साल किराया 10% बढ़ाया जाएगा।

मुख्य बातें:
1. सुरक्षा जमा (Security Deposit) ₹4,50,000 है जो अनुबंध शुरू होने के 30 दिनों में जमा करनी होगी।
2. 24 महीने का लॉक-इन पीरियड है। यदि किरायेदार 24 महीने से पहले जगह खाली करता है, तो उसे बाकी बचे महीनों का पूरा किराया देना होगा।
3. क्लॉज 14.2 में एकतरफा क्षतिपूर्ति (Indemnity) शर्त है: अगर मकान मालिक की लापरवाही से कोई नुकसान होता है, तो भी किरायेदार को जिम्मेदार माना जाएगा। यह शर्त बदलने की जरूरत है।`
                    : `This agreement is a 36-month commercial lease requiring the Tenant (Beta Labs) to pay a base monthly rent of ₹1,50,000 with a 10% annual escalation.

Key Highlights:
1. Security deposit of ₹4,50,000 must be remitted within 30 days of execution.
2. Contains a 24-month minimum lock-in period. Vacating early requires paying accelerated rent for all remaining months.
3. Clause 14.2 imposes a unilateral indemnity forcing Tenant to cover Landlord losses even in cases of Landlord's negligence.`}
                </p>
              </div>

              {/* Legal Terms Glossary */}
              <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm space-y-3">
                <h4 className="font-bold text-xs uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
                  <BookOpen className="w-4 h-4 text-brand-600" />
                  <span>Key Legal Terms Glossary (कानूनी शब्दावली)</span>
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-1">
                    <div className="flex items-center justify-between text-xs font-bold">
                      <span className="text-brand-900">Indemnification</span>
                      <span className="text-slate-500 font-mono">क्षतिपूर्ति</span>
                    </div>
                    <p className="text-[11px] text-slate-600">
                      An obligation where one party promises to compensate the other for specified financial loss or legal claims.
                    </p>
                  </div>

                  <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-1">
                    <div className="flex items-center justify-between text-xs font-bold">
                      <span className="text-brand-900">Liquidated Damages</span>
                      <span className="text-slate-500 font-mono">पूर्वनिर्धारित हर्जाना</span>
                    </div>
                    <p className="text-[11px] text-slate-600">
                      A predetermined amount of money agreed upon in the contract to be paid if a breach occurs (e.g. early exit penalty).
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* MODULE 6: CLAUSE CATEGORIZATION */}
          {activeModule === 'clause_categorization' && (
            <div className="space-y-4">
              <div>
                <h3 className="text-base font-bold text-slate-900">
                  Automated Multi-Class Clause Classification
                </h3>
                <p className="text-xs text-slate-500">
                  Segments contracts into 11 specialized legal domains with plain-language explanations.
                </p>
              </div>

              <div className="flex items-center gap-1.5 flex-wrap">
                {[
                  'Liability and Indemnity',
                  'Payment and Fees',
                  'Termination',
                  'Governing Law',
                  'Dispute Resolution',
                ].map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                      selectedCategory === cat
                        ? 'bg-brand-600 text-white shadow-sm'
                        : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-100'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>

              <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-mono font-bold px-2.5 py-1 rounded bg-brand-50 text-brand-700 border border-brand-200">
                    {selectedCategory}
                  </span>
                  <span className="text-[11px] font-mono text-slate-400">Clause Reference: 14.1 - 14.4</span>
                </div>

                <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 text-xs text-slate-800 space-y-1">
                  <span className="font-semibold text-brand-700 block">Plain-Language Meaning:</span>
                  <p className="leading-relaxed">
                    {selectedCategory === 'Liability and Indemnity' &&
                      'Requires the tenant to assume legal and financial responsibility for injuries or property damage on the premises, while attempting to exonerate the landlord from standard liabilities.'}
                    {selectedCategory === 'Payment and Fees' &&
                      'Defines the base rent of ₹1,50,000 due by the 5th of every month, with an 18% annual late fee and a 10% rent bump after each 12-month period.'}
                    {selectedCategory === 'Termination' &&
                      'Establishes a 90-day written notice requirement, subject to an enforceable 24-month non-cancellable lock-in period.'}
                    {selectedCategory === 'Governing Law' &&
                      'Specifies that this contract is governed by the laws of India, with exclusive jurisdiction in the Courts of Mumbai, Maharashtra.'}
                    {selectedCategory === 'Dispute Resolution' &&
                      'Mandates 30 days of mutual executive negotiation before submitting unresolved disputes to a sole arbitrator under the Arbitration and Conciliation Act, 1996.'}
                  </p>
                </div>

                <div className="text-[11px] font-mono text-slate-600 bg-slate-100/50 p-3 rounded-xl border border-slate-200 italic leading-relaxed">
                  {selectedCategory === 'Liability and Indemnity' &&
                    '"14.2 Indemnity: Lessee shall indemnify, defend and hold harmless Lessor from all claims, suits, judgments, or damages arising out of the occupancy of the premises."'}
                  {selectedCategory === 'Payment and Fees' &&
                    '"4.1 Base Rent: Lessee covenants to pay to Lessor base rent of INR 1,50,000 per month on or before the fifth (5th) day of each calendar month in advance."'}
                  {selectedCategory === 'Termination' &&
                    '"12.1 Termination: Either party may terminate this Lease upon 90 days prior written notice; provided that Lessee cannot terminate prior to the expiry of the 24-month lock-in."'}
                  {selectedCategory === 'Governing Law' &&
                    '"18.1 Jurisdiction: This Agreement shall be construed and governed in accordance with the laws of the Republic of India. Courts at Mumbai shall have exclusive jurisdiction."'}
                  {selectedCategory === 'Dispute Resolution' &&
                    '"17.1 Arbitration: Any dispute arising out of this Agreement shall be referred to arbitration by a sole arbitrator appointed mutually by the parties under Mumbai jurisdiction."'}
                </div>
              </div>
            </div>
          )}

          {/* MODULE 7: OBLIGATIONS & DEADLINE TRACKER */}
          {activeModule === 'obligations_tracker' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-base font-bold text-slate-900">
                    Obligations & Deadline Compliance Tracker
                  </h3>
                  <p className="text-xs text-slate-500">
                    Extracts explicit contractual milestones with responsible parties and due dates. Click status to test interactive toggle.
                  </p>
                </div>
              </div>

              <div className="space-y-3">
                {obligationsList.map((ob) => (
                  <div
                    key={ob.id}
                    className={`bg-white rounded-2xl border p-4 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-3 transition-all ${
                      ob.status === 'Completed' ? 'border-emerald-200 bg-emerald-50/20 opacity-80' : 'border-slate-200'
                    }`}
                  >
                    <div className="space-y-1">
                      <div className="flex items-center space-x-2">
                        <span
                          className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase ${
                            ob.priority === 'High'
                              ? 'bg-red-100 text-red-800'
                              : 'bg-amber-100 text-amber-800'
                          }`}
                        >
                          {ob.priority} Priority
                        </span>
                        <h4
                          className={`font-bold text-xs ${
                            ob.status === 'Completed' ? 'line-through text-slate-500' : 'text-slate-900'
                          }`}
                        >
                          {ob.title}
                        </h4>
                      </div>
                      <div className="flex items-center gap-3 text-[11px] text-slate-500 font-mono">
                        <span>Party: <strong className="text-slate-800">{ob.party}</strong></span>
                        <span>•</span>
                        <span>Due: <strong className="text-brand-700">{ob.due}</strong></span>
                      </div>
                    </div>

                    <button
                      onClick={() => toggleObligation(ob.id)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center space-x-1.5 self-start sm:self-auto transition-all ${
                        ob.status === 'Completed'
                          ? 'bg-emerald-100 text-emerald-800 hover:bg-emerald-200'
                          : 'bg-slate-100 hover:bg-brand-50 hover:text-brand-700 text-slate-700'
                      }`}
                    >
                      <CheckCircle2
                        className={`w-3.5 h-3.5 ${
                          ob.status === 'Completed' ? 'text-emerald-600' : 'text-slate-400'
                        }`}
                      />
                      <span>{ob.status === 'Completed' ? 'Completed' : 'Mark Completed'}</span>
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* MODULE 8: DOCUMENT COMPARISON */}
          {activeModule === 'document_comparison' && (
            <div className="space-y-4">
              <div>
                <h3 className="text-base font-bold text-slate-900">
                  Cross-Contract Comparison & Risk Shift Matrix
                </h3>
                <p className="text-xs text-slate-500">
                  Comparing <strong>Baseline Draft (2024)</strong> vs <strong>Landlord Counter-Proposal (2025)</strong>
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm space-y-2">
                  <div className="flex items-center justify-between text-xs font-bold text-slate-800 border-b border-slate-100 pb-2">
                    <span>Baseline Draft (Document A)</span>
                    <span className="text-[10px] bg-slate-100 px-2 py-0.5 rounded font-mono">Original</span>
                  </div>
                  <ul className="text-xs text-slate-600 space-y-2">
                    <li className="p-2.5 bg-slate-50 rounded-xl">
                      <strong>Escalation Rate:</strong> 7% per annum after each 12-month period.
                    </li>
                    <li className="p-2.5 bg-slate-50 rounded-xl">
                      <strong>Security Refund:</strong> Due within 15 calendar days of peaceful handover.
                    </li>
                    <li className="p-2.5 bg-slate-50 rounded-xl">
                      <strong>Notice Period:</strong> Mutual 60 days written notice with no lock-in.
                    </li>
                  </ul>
                </div>

                <div className="bg-white p-4 rounded-2xl border border-amber-200 bg-amber-50/10 shadow-sm space-y-2">
                  <div className="flex items-center justify-between text-xs font-bold text-amber-900 border-b border-amber-100 pb-2">
                    <span>Landlord Counter-Proposal (Document B)</span>
                    <span className="text-[10px] bg-amber-100 text-amber-800 px-2 py-0.5 rounded font-mono font-bold">Revised</span>
                  </div>
                  <ul className="text-xs text-slate-600 space-y-2">
                    <li className="p-2.5 bg-amber-50/80 rounded-xl border border-amber-200 text-amber-950">
                      <strong>Escalation Rate:</strong> 10% per annum (Increased by 3% compounding).
                    </li>
                    <li className="p-2.5 bg-amber-50/80 rounded-xl border border-amber-200 text-amber-950">
                      <strong>Security Refund:</strong> Delayed to 45 business days + landlord unilateral deduction rights.
                    </li>
                    <li className="p-2.5 bg-amber-50/80 rounded-xl border border-amber-200 text-amber-950">
                      <strong>Notice Period:</strong> 90 days required + mandatory 24-month lock-in penalty.
                    </li>
                  </ul>
                </div>
              </div>

              <div className="p-4 bg-brand-50 border border-brand-200 rounded-2xl text-xs text-brand-950 space-y-1">
                <span className="font-bold flex items-center gap-1.5">
                  <ShieldAlert className="w-4 h-4 text-brand-700" />
                  <span>AI Risk Profile Shift Verdict:</span>
                </span>
                <p className="leading-relaxed">
                  Document B shifts substantial financial risk and liquidity constraints onto the Tenant. Estimated 3-year rent liability increases by ₹4,12,000, while security deposit recovery risk increases from Low to High.
                </p>
              </div>
            </div>
          )}

          {/* MODULE 9: DOWNLOADABLE PDF REPORT */}
          {activeModule === 'downloadable_report' && (
            <div className="space-y-4">
              <div>
                <h3 className="text-base font-bold text-slate-900">
                  Publication-Quality PDF Audit Report Export
                </h3>
                <p className="text-xs text-slate-500">
                  Generates an executive-ready PDF audit report containing complete findings, evidence quotes, and legal disclaimers.
                </p>
              </div>

              <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm flex flex-col md:flex-row items-center justify-between gap-6">
                <div className="space-y-3 max-w-md">
                  <div className="inline-flex items-center space-x-1.5 px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-bold">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>Live PDFKit Engine Output</span>
                  </div>
                  <h4 className="text-base font-bold text-slate-900">
                    LexiAI Executive Audit — Commercial_Lease.pdf
                  </h4>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    Includes Executive Overview, 3 Severity-Ranked Risk Findings with verbatim contract citations, 3 Suspicious Drafting Indicators, 5 Categorized Clauses, and Timeline Compliance Tracker.
                  </p>
                </div>

                <div className="p-5 bg-slate-900 text-white rounded-2xl space-y-3 w-full md:w-64 text-center shrink-0">
                  <FileDown className="w-8 h-8 text-brand-400 mx-auto" />
                  <div>
                    <p className="text-xs font-bold">Audit Report Ready</p>
                    <p className="text-[10px] text-slate-400">PDF • 5 Pages • Vector Formatted</p>
                  </div>
                  <button
                    onClick={handleLaunchFullWorkspace}
                    disabled={loadingDemoLaunch}
                    className="w-full py-2.5 bg-brand-600 hover:bg-brand-700 text-white font-semibold rounded-xl text-xs shadow-md transition-all hover:scale-105 flex items-center justify-center space-x-1.5"
                  >
                    <span>Launch & Export PDF</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Modal Bottom Action Bar */}
        <div className="px-6 py-4 bg-white border-t border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center space-x-2 text-xs text-slate-500">
            <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
            <span>Ready for real document processing. Upload your own contract anytime.</span>
          </div>

          <div className="flex items-center space-x-3 self-end sm:self-auto">
            <button
              onClick={onClose}
              className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-medium transition-colors"
            >
              Close Preview
            </button>
            <button
              onClick={handleLaunchFullWorkspace}
              disabled={loadingDemoLaunch}
              className="px-5 py-2.5 bg-brand-600 hover:bg-brand-700 disabled:opacity-50 text-white font-semibold rounded-xl text-xs shadow-md shadow-brand-500/20 flex items-center space-x-1.5 transition-all hover:scale-105"
            >
              {loadingDemoLaunch ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  <span>Preparing Workspace...</span>
                </>
              ) : (
                <>
                  <span>Launch Live Workspace (1-Click Demo)</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
