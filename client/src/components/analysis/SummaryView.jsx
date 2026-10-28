import React, { useState } from 'react';
import {
  Sparkles,
  Building2,
  Calendar,
  CreditCard,
  AlertTriangle,
  CheckCircle,
  FileText,
  Clock,
  ArrowRight,
  ShieldAlert,
  Loader2,
} from 'lucide-react';
import api from '../../services/api';
import { useAuth } from '../../context/AuthContext';

export const SummaryView = ({ document, analysis, onAnalysisUpdated, onNavigateTab }) => {
  const { hasValidAiKey } = useAuth();
  const [analyzing, setAnalyzing] = useState(false);
  const [error, setError] = useState(null);

  const handleRunAnalysis = async () => {
    setAnalyzing(true);
    setError(null);
    try {
      const res = await api.post(`/analysis/${document._id}`);
      if (res.data?.success) {
        onAnalysisUpdated(res.data.data);
      }
    } catch (err) {
      setError(
        err.response?.data?.message ||
        err.message ||
        'Failed to run AI analysis. Please verify your Gemini API key in Settings.'
      );
    } finally {
      setAnalyzing(false);
    }
  };

  if (!analysis || analysis.status !== 'completed') {
    return (
      <div className="bg-white rounded-3xl border border-slate-200 p-8 sm:p-12 text-center space-y-6 shadow-sm">
        <div className="w-16 h-16 rounded-3xl bg-brand-50 text-brand-600 flex items-center justify-center mx-auto shadow-sm">
          <Sparkles className="w-8 h-8" />
        </div>

        <div className="max-w-md mx-auto space-y-2">
          <h3 className="font-extrabold text-slate-900 text-lg">AI Legal Analysis Ready</h3>
          <p className="text-xs text-slate-500 leading-relaxed">
            Generate an executive summary, party obligations, unfavorable clauses, and risk diagnostics with Google Gemini legal intelligence.
          </p>
        </div>

        {error && (
          <div className="max-w-md mx-auto p-3.5 bg-red-50 border border-red-200 rounded-2xl text-red-700 text-xs flex items-center space-x-2">
            <AlertTriangle className="w-4 h-4 shrink-0" />
            <span className="text-left">{error}</span>
          </div>
        )}

        <div className="pt-2">
          <button
            onClick={handleRunAnalysis}
            disabled={analyzing}
            className="px-8 py-3.5 bg-brand-600 hover:bg-brand-700 disabled:opacity-50 text-white font-semibold rounded-xl text-xs shadow-md shadow-brand-500/20 inline-flex items-center space-x-2 transition-all hover:scale-105"
          >
            {analyzing ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Auditing Document with Gemini AI...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4" />
                <span>Start AI Legal Analysis</span>
              </>
            )}
          </button>
        </div>

        {!hasValidAiKey && (
          <p className="text-[11px] text-amber-600">
            Note: Requires a Gemini API key. Add it under Settings or in your server configuration.
          </p>
        )}
      </div>
    );
  }

  const { summary, keyClauses, documentType } = analysis;

  return (
    <div className="space-y-6">
      {/* Document Type & High-Level Executive Summary */}
      <div className="bg-gradient-to-br from-slate-900 via-brand-950 to-indigo-950 text-white rounded-3xl p-6 sm:p-8 shadow-xl space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <span className="px-3 py-1 rounded-full bg-brand-500/20 text-brand-300 border border-brand-500/30 text-xs font-semibold uppercase tracking-wider font-mono">
            {documentType || 'Contract'}
          </span>
          <span className="text-xs text-slate-400 font-mono">
            Analyzed via Gemini Legal AI
          </span>
        </div>

        <div>
          <h2 className="text-lg sm:text-xl font-bold text-white tracking-tight mb-2">
            Executive Summary
          </h2>
          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-sans">
            {summary?.overview || 'Executive summary generated for this document.'}
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t border-slate-800 text-xs text-slate-300">
          <div className="flex items-start space-x-2.5">
            <CreditCard className="w-4 h-4 text-brand-400 shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold text-white">Financial & Payment Terms</p>
              <p className="text-[11px] text-slate-400 mt-0.5">{summary?.financialTerms || 'Not specified'}</p>
            </div>
          </div>

          <div className="flex items-start space-x-2.5">
            <Calendar className="w-4 h-4 text-indigo-400 shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold text-white">Term, Duration & Renewal</p>
              <p className="text-[11px] text-slate-400 mt-0.5">{summary?.durationAndTerm || 'Not specified'}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Party Roles & Allocation of Responsibilities */}
      {summary?.partyRoles?.length > 0 && (
        <div className="space-y-3">
          <h3 className="font-bold text-sm text-slate-900 flex items-center space-x-2">
            <Building2 className="w-4 h-4 text-brand-600" />
            <span>Parties & Contractual Allocation</span>
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {summary.partyRoles.map((party, idx) => (
              <div key={idx} className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="font-bold text-xs text-slate-900">{party.party}</h4>
                  <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-slate-100 text-slate-600">
                    {party.role}
                  </span>
                </div>

                <div className="space-y-1.5">
                  <p className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">Key Responsibilities:</p>
                  <ul className="space-y-1">
                    {party.keyResponsibilities?.map((resp, rIdx) => (
                      <li key={rIdx} className="text-xs text-slate-700 flex items-start space-x-2">
                        <CheckCircle className="w-3.5 h-3.5 text-emerald-500 shrink-0 mt-0.5" />
                        <span>{resp}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Critical Conditions & Potentially Unfavorable Terms */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Critical Conditions */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-3">
          <h3 className="font-bold text-xs text-slate-900 uppercase tracking-wider text-brand-600 flex items-center space-x-1.5">
            <Clock className="w-4 h-4 text-brand-600" />
            <span>Critical Conditions & Prerequisites</span>
          </h3>
          <ul className="space-y-2">
            {summary?.criticalConditions?.map((cond, idx) => (
              <li key={idx} className="text-xs text-slate-700 flex items-start space-x-2 bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                <span className="text-brand-600 font-bold">•</span>
                <span>{cond}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Unfavorable / One-Sided Terms */}
        <div className="bg-white p-5 rounded-2xl border border-red-200 bg-red-50/10 shadow-sm space-y-3">
          <h3 className="font-bold text-xs text-red-600 uppercase tracking-wider flex items-center space-x-1.5">
            <ShieldAlert className="w-4 h-4 text-red-600" />
            <span>Potentially Unfavorable Terms</span>
          </h3>
          <ul className="space-y-2">
            {summary?.unfavorableTerms?.map((term, idx) => (
              <li key={idx} className="text-xs text-slate-800 flex items-start space-x-2 bg-red-50/60 p-2.5 rounded-xl border border-red-100">
                <span className="text-red-600 font-bold">•</span>
                <span>{term}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Deep-Dive Module Launchpad */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm space-y-4">
        <div>
          <h3 className="font-bold text-sm text-slate-900">Next Steps & Deep-Dive Analysis</h3>
          <p className="text-xs text-slate-500">Jump directly into the specialized legal intelligence modules for this contract</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <button
            onClick={() => onNavigateTab && onNavigateTab('risks')}
            className="p-4 bg-red-50/50 hover:bg-red-50 border border-red-200 rounded-2xl text-left transition-all group"
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-red-700">Risk & Anomaly Scanner</span>
              <ArrowRight className="w-4 h-4 text-red-500 group-hover:translate-x-1 transition-transform" />
            </div>
            <p className="text-[11px] text-slate-600 mt-1">
              {analysis.risks?.length || 0} flagged clauses ranked by High/Medium/Low liability severity.
            </p>
          </button>

          <button
            onClick={() => onNavigateTab && onNavigateTab('clauses')}
            className="p-4 bg-brand-50/50 hover:bg-brand-50 border border-brand-200 rounded-2xl text-left transition-all group"
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-brand-700">Categorized Clauses</span>
              <ArrowRight className="w-4 h-4 text-brand-500 group-hover:translate-x-1 transition-transform" />
            </div>
            <p className="text-[11px] text-slate-600 mt-1">
              Search and filter all clauses across 11 legal domains with plain explanations.
            </p>
          </button>

          <button
            onClick={() => onNavigateTab && onNavigateTab('chat')}
            className="p-4 bg-purple-50/50 hover:bg-purple-50 border border-purple-200 rounded-2xl text-left transition-all group"
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-purple-700">Ask Document Chat</span>
              <ArrowRight className="w-4 h-4 text-purple-500 group-hover:translate-x-1 transition-transform" />
            </div>
            <p className="text-[11px] text-slate-600 mt-1">
              Ask questions grounded strictly in this contract with cited clauses.
            </p>
          </button>
        </div>
      </div>
    </div>
  );
};
