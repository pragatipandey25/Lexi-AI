import React from 'react';
import { Link } from 'react-router-dom';
import {
  Shield,
  FileSearch,
  AlertTriangle,
  MessageSquare,
  Languages,
  Tags,
  Calendar,
  GitCompare,
  FileDown,
  BarChart3,
  ArrowRight,
  CheckCircle2,
  Lock,
  Sparkles,
  ChevronRight,
  Eye,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export const LandingPage = () => {
  const { user } = useAuth();

  const features = [
    {
      title: 'Smart Document Processing',
      desc: 'High-accuracy text extraction from native digital PDFs combined with Tesseract OCR fallback for scanned pages.',
      icon: FileSearch,
      tag: 'Module 01',
      badge: 'PDF + OCR',
    },
    {
      title: 'AI Legal Analysis',
      desc: 'Executive summaries, party rights & responsibilities, key terms, and plain-language translations of convoluted legalese.',
      icon: Sparkles,
      tag: 'Module 02',
      badge: 'Gemini 1.5/2.0',
    },
    {
      title: 'Risk & Suspicious Scanner',
      desc: 'Dual-pipeline engine: detects high/med/low legal liability risks while simultaneously catching date conflicts, missing clauses & contradictions.',
      icon: AlertTriangle,
      tag: 'Module 03',
      badge: 'Severity Ranked',
    },
    {
      title: 'AI Document Chat',
      desc: 'Ask direct questions grounded exclusively in your contract. Includes specific clause citations and page references.',
      icon: MessageSquare,
      tag: 'Module 04',
      badge: 'Grounded Q&A',
    },
    {
      title: 'Bilingual Explanations',
      desc: 'Switch between simple English and colloquial Hindi (हिंदी) explanations for individual clauses or complete agreements.',
      icon: Languages,
      tag: 'Module 05',
      badge: 'English + Hindi',
    },
    {
      title: 'Clause Categorization',
      desc: 'Automatically parses and tags clauses: Liability, Termination, Payment, Confidentiality, Governing Law, IP, and more.',
      icon: Tags,
      tag: 'Module 06',
      badge: 'Auto-Tagged',
    },
    {
      title: 'Obligations & Deadlines',
      desc: 'Extracts explicit deadlines, payment milestones, and responsible parties with interactive status tracking (Pending, Completed, Overdue).',
      icon: Calendar,
      tag: 'Module 07',
      badge: 'Timeline Tracker',
    },
    {
      title: 'Interactive Dashboard',
      desc: 'Comprehensive oversight of contract volume, aggregate risk distributions, pending commitments, and document history.',
      icon: BarChart3,
      tag: 'Module 08',
      badge: 'Live Metrics',
    },
    {
      title: 'Document Comparison',
      desc: 'Select two contracts to spot textual differences, clause omissions, payment condition changes, and shifts in risk profile.',
      icon: GitCompare,
      tag: 'Module 09',
      badge: 'Side-by-Side Diff',
    },
    {
      title: 'Downloadable PDF Report',
      desc: 'Generate professional, executive-ready PDF audit reports complete with findings, clause evidence, and legal disclaimers.',
      icon: FileDown,
      tag: 'Module 10',
      badge: 'PDFKit Export',
    },
  ];

  return (
    <div className="space-y-24 pb-16">
      {/* Hero Section */}
      <section className="relative pt-12 pb-16 lg:pt-20 overflow-hidden">
        <div className="absolute inset-0 -z-10 bg-[radial-gradient(45rem_50rem_at_top,theme(colors.brand.100),theme(colors.slate.50))] opacity-60" />

        <div className="max-w-4xl mx-auto text-center space-y-6 px-4">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-brand-50 border border-brand-200 text-brand-700 text-xs font-semibold">
            <Sparkles className="w-3.5 h-3.5 text-brand-600" />
            <span>AI-Powered Legal Intelligence Engine</span>
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-slate-950 tracking-tight leading-[1.15]">
            Read Legal Contracts <br />
            <span className="bg-gradient-to-r from-brand-600 via-indigo-600 to-brand-800 bg-clip-text text-transparent">
              Without the Confusion or Hidden Risks.
            </span>
          </h1>

          <p className="text-base sm:text-lg text-slate-600 max-w-2xl mx-auto leading-relaxed">
            LexiAI simplifies dense legal contracts into plain English and Hindi, flags one-sided liabilities, catches suspicious contradictions, and manages deadlines with evidence-grounded AI.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-4">
            {user ? (
              <Link
                to="/dashboard"
                className="w-full sm:w-auto px-7 py-3.5 bg-brand-600 hover:bg-brand-700 text-white font-semibold rounded-xl shadow-lg shadow-brand-500/25 flex items-center justify-center space-x-2 transition-all hover:scale-[1.02]"
              >
                <span>Go to Dashboard</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            ) : (
              <>
                <Link
                  to="/register"
                  className="w-full sm:w-auto px-7 py-3.5 bg-brand-600 hover:bg-brand-700 text-white font-semibold rounded-xl shadow-lg shadow-brand-500/25 flex items-center justify-center space-x-2 transition-all hover:scale-[1.02]"
                >
                  <span>Start Free Analysis</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
                <Link
                  to="/login"
                  className="w-full sm:w-auto px-7 py-3.5 bg-white hover:bg-slate-50 text-slate-700 font-semibold rounded-xl border border-slate-300 shadow-sm flex items-center justify-center transition-all"
                >
                  <span>Sign In</span>
                </Link>
              </>
            )}
          </div>

          <div className="flex items-center justify-center gap-6 pt-4 text-xs text-slate-500">
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-500" /> Grounded in Actual Clauses
            </span>
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-500" /> Zero Hallucinated Citations
            </span>
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-500" /> Private & Secure
            </span>
          </div>
        </div>

        {/* Visual Preview Teaser Card */}
        <div className="mt-14 max-w-5xl mx-auto px-4">
          <div className="bg-white rounded-2xl shadow-xl border border-slate-200 overflow-hidden">
            <div className="bg-slate-900 px-4 py-3 flex items-center justify-between text-xs text-slate-300">
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 rounded-full bg-red-500/80" />
                <div className="w-3 h-3 rounded-full bg-amber-500/80" />
                <div className="w-3 h-3 rounded-full bg-emerald-500/80" />
                <span className="ml-2 font-mono text-slate-400">LexiAI Analysis View — Commercial_Lease_Agreement.pdf</span>
              </div>
              <span className="px-2 py-0.5 rounded bg-brand-500/20 text-brand-300 text-[11px] font-semibold">
                AI Processed
              </span>
            </div>

            <div className="p-6 grid grid-cols-1 md:grid-cols-3 gap-6 bg-slate-50/50">
              <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm space-y-2">
                <div className="flex items-center justify-between text-xs font-semibold text-slate-500">
                  <span>EXECUTIVE SUMMARY</span>
                  <span className="text-emerald-600 font-bold">Lease Agreement</span>
                </div>
                <p className="text-xs text-slate-700 leading-relaxed">
                  36-month commercial property lease between Acme Corp (Landlord) and Beta Labs (Tenant) with standard maintenance, but restrictive indemnities.
                </p>
              </div>

              <div className="bg-white p-4 rounded-xl border border-red-200 bg-red-50/20 shadow-sm space-y-2">
                <div className="flex items-center justify-between text-xs font-semibold text-red-600">
                  <span className="flex items-center gap-1">
                    <AlertTriangle className="w-3.5 h-3.5" /> HIGH RISK DETECTED
                  </span>
                  <span className="text-[10px] bg-red-100 text-red-700 px-1.5 py-0.5 rounded font-mono font-bold">Clause 14.2</span>
                </div>
                <p className="text-xs text-slate-700 leading-relaxed">
                  <strong>Unilateral Indemnity:</strong> Tenant indemnifies Landlord for all claims, even those resulting from Landlord&apos;s own gross negligence.
                </p>
              </div>

              <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm space-y-2">
                <div className="flex items-center justify-between text-xs font-semibold text-indigo-600">
                  <span className="flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5" /> UPCOMING DEADLINE
                  </span>
                  <span className="text-[10px] bg-indigo-100 text-indigo-700 px-1.5 py-0.5 rounded font-mono font-bold">In 30 Days</span>
                </div>
                <p className="text-xs text-slate-700 leading-relaxed">
                  <strong>Security Deposit Balance:</strong> Tenant must deposit remaining ₹1,50,000 within 30 days of execution (Due: 15 Nov).
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Feature Grid Section */}
      <section id="features" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        <div className="text-center max-w-2xl mx-auto space-y-3">
          <h2 className="text-xs font-bold uppercase tracking-wider text-brand-600">Comprehensive Legal Suite</h2>
          <h3 className="text-3xl font-extrabold text-slate-900 tracking-tight">
            10 Built-In AI Modules Designed for Real Legal Workflows
          </h3>
          <p className="text-sm text-slate-600">
            From raw scanned PDFs to cross-document comparison and courtroom-ready audit reports.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, idx) => {
            const Icon = feature.icon;
            return (
              <div
                key={idx}
                className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm hover:shadow-md hover:border-brand-200 transition-all flex flex-col justify-between group"
              >
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="w-12 h-12 rounded-xl bg-brand-50 text-brand-600 flex items-center justify-center group-hover:scale-110 group-hover:bg-brand-600 group-hover:text-white transition-all">
                      <Icon className="w-6 h-6" />
                    </div>
                    <span className="text-[10px] font-mono font-semibold px-2 py-1 rounded-md bg-slate-100 text-slate-600">
                      {feature.badge}
                    </span>
                  </div>

                  <div>
                    <span className="text-[10px] font-mono uppercase tracking-wider text-slate-400 font-bold block mb-1">
                      {feature.tag}
                    </span>
                    <h4 className="text-lg font-bold text-slate-900 group-hover:text-brand-600 transition-colors">
                      {feature.title}
                    </h4>
                    <p className="text-xs text-slate-600 leading-relaxed mt-2">
                      {feature.desc}
                    </p>
                  </div>
                </div>

                <div className="pt-4 mt-4 border-t border-slate-100 flex items-center text-xs text-brand-600 font-semibold group-hover:translate-x-1 transition-transform">
                  <span>Explore in action</span>
                  <ChevronRight className="w-3.5 h-3.5 ml-1" />
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* How It Works Section */}
      <section className="bg-slate-900 text-white py-16 -mx-4 sm:-mx-6 lg:-mx-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-5xl mx-auto space-y-12">
          <div className="text-center space-y-2">
            <span className="text-xs font-bold uppercase tracking-wider text-brand-400">Execution Pipeline</span>
            <h3 className="text-3xl font-extrabold tracking-tight">How LexiAI Analyzes Documents</h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center sm:text-left">
            <div className="space-y-3 p-6 rounded-2xl bg-slate-800/60 border border-slate-700">
              <div className="w-10 h-10 rounded-xl bg-brand-500/20 text-brand-400 flex items-center justify-center font-bold text-lg font-mono">
                1
              </div>
              <h4 className="font-bold text-base text-white">Hybrid Text Extraction</h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                Upload your contract PDF. LexiAI runs structured digital text extraction and falls back to Tesseract OCR when scanned pages are detected.
              </p>
            </div>

            <div className="space-y-3 p-6 rounded-2xl bg-slate-800/60 border border-slate-700">
              <div className="w-10 h-10 rounded-xl bg-brand-500/20 text-brand-400 flex items-center justify-center font-bold text-lg font-mono">
                2
              </div>
              <h4 className="font-bold text-base text-white">Gemini Legal Intelligence</h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                Structured prompts parse clauses, detect unbalanced risks, cross-examine dates and parties, and extract obligations without hallucination.
              </p>
            </div>

            <div className="space-y-3 p-6 rounded-2xl bg-slate-800/60 border border-slate-700">
              <div className="w-10 h-10 rounded-xl bg-brand-500/20 text-brand-400 flex items-center justify-center font-bold text-lg font-mono">
                3
              </div>
              <h4 className="font-bold text-base text-white">Interactive Review & Reports</h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                Explore risk severity badges, ask document-grounded questions in chat, toggle Hindi translations, and export downloadable PDF audit reports.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="max-w-4xl mx-auto px-4 text-center space-y-6">
        <h3 className="text-3xl font-extrabold text-slate-900 tracking-tight">
          Ready to inspect your legal agreements?
        </h3>
        <p className="text-sm text-slate-600 max-w-xl mx-auto">
          Upload any NDA, Employment Agreement, Commercial Lease, or Service Contract to get started in seconds.
        </p>
        <div className="pt-2">
          <Link
            to={user ? "/dashboard" : "/register"}
            className="inline-flex items-center space-x-2 px-8 py-3.5 bg-brand-600 hover:bg-brand-700 text-white font-semibold rounded-xl shadow-lg shadow-brand-500/20 transition-all hover:scale-105"
          >
            <span>{user ? "Open Dashboard" : "Create Free Account"}</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </section>
    </div>
  );
};
