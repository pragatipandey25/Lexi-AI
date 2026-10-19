import React, { useState, useEffect } from 'react';
import {
  GitCompare,
  FileText,
  ArrowRight,
  Sparkles,
  Loader2,
  CheckCircle2,
  AlertTriangle,
  Scale,
  MinusCircle,
  PlusCircle,
  ShieldAlert,
} from 'lucide-react';
import api from '../services/api';

export const ComparePage = () => {
  const [documents, setDocuments] = useState([]);
  const [loadingDocs, setLoadingDocs] = useState(true);

  const [doc1Id, setDoc1Id] = useState('');
  const [doc2Id, setDoc2Id] = useState('');
  const [comparing, setComparing] = useState(false);
  const [comparisonResult, setComparisonResult] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDocs = async () => {
      try {
        const res = await api.get('/documents');
        if (res.data?.success) {
          const docs = res.data.data.documents || [];
          setDocuments(docs);
          if (docs.length >= 2) {
            setDoc1Id(docs[0]._id);
            setDoc2Id(docs[1]._id);
          } else if (docs.length === 1) {
            setDoc1Id(docs[0]._id);
          }
        }
      } catch (err) {
        console.warn('Could not load documents for comparison:', err);
      } finally {
        setLoadingDocs(false);
      }
    };

    fetchDocs();
  }, []);

  const handleCompare = async () => {
    if (!doc1Id || !doc2Id) {
      setError('Please select two documents to compare');
      return;
    }
    if (doc1Id === doc2Id) {
      setError('Please select two distinct contracts to compare');
      return;
    }

    setComparing(true);
    setError(null);
    setComparisonResult(null);

    try {
      const res = await api.post('/compare', { doc1Id, doc2Id });
      if (res.data?.success) {
        setComparisonResult(res.data.data);
      }
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Comparison failed');
    } finally {
      setComparing(false);
    }
  };

  const doc1 = documents.find((d) => d._id === doc1Id);
  const doc2 = documents.find((d) => d._id === doc2Id);

  return (
    <div className="space-y-6 pb-16">
      <div>
        <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">Dual Contract Comparison</h1>
        <p className="text-xs text-slate-500 mt-1">
          Select any two contracts to spot omissions, compare payment & termination terms, and evaluate risk shifts.
        </p>
      </div>

      {/* Contract Selection Box */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Doc 1 */}
          <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-2">
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">
              Baseline Contract (Document A)
            </span>
            <select
              value={doc1Id}
              onChange={(e) => setDoc1Id(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs font-semibold focus:ring-2 focus:ring-brand-500 bg-white"
            >
              <option value="">Select Baseline Contract...</option>
              {documents.map((d) => (
                <option key={d._id} value={d._id}>
                  {d.originalName} ({d.pageCount}p)
                </option>
              ))}
            </select>
          </div>

          {/* Doc 2 */}
          <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-2">
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">
              Revised / Counter Contract (Document B)
            </span>
            <select
              value={doc2Id}
              onChange={(e) => setDoc2Id(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs font-semibold focus:ring-2 focus:ring-brand-500 bg-white"
            >
              <option value="">Select Comparison Contract...</option>
              {documents.map((d) => (
                <option key={d._id} value={d._id}>
                  {d.originalName} ({d.pageCount}p)
                </option>
              ))}
            </select>
          </div>
        </div>

        {error && (
          <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-red-700 text-xs flex items-center space-x-2">
            <AlertTriangle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <div className="flex justify-end pt-2">
          <button
            onClick={handleCompare}
            disabled={comparing || !doc1Id || !doc2Id || doc1Id === doc2Id}
            className="px-6 py-2.5 bg-brand-600 hover:bg-brand-700 disabled:opacity-50 text-white rounded-xl text-xs font-semibold shadow-sm flex items-center space-x-2 transition-all hover:scale-105"
          >
            {comparing ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Running Gemini Cross-Contract Analysis...</span>
              </>
            ) : (
              <>
                <GitCompare className="w-4 h-4" />
                <span>Compare Contracts</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Comparison Results */}
      {comparisonResult && (
        <div className="space-y-6 animate-in fade-in duration-300">
          {/* Executive Comparison Summary */}
          <div className="bg-gradient-to-br from-slate-900 to-indigo-950 text-white p-6 sm:p-8 rounded-3xl shadow-xl space-y-3">
            <div className="flex items-center space-x-2">
              <Sparkles className="w-4 h-4 text-brand-400" />
              <h2 className="text-base font-bold text-white tracking-tight">Executive Comparison Assessment</h2>
            </div>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              {comparisonResult.comparison?.summaryOfComparison}
            </p>
          </div>

          {/* Similarities & Differences */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Similarities */}
            <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm space-y-3">
              <h3 className="font-bold text-xs uppercase tracking-wider text-emerald-700 flex items-center space-x-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>Shared Terms & Similarities</span>
              </h3>
              <ul className="space-y-2">
                {comparisonResult.comparison?.similarities?.map((sim, idx) => (
                  <li key={idx} className="p-3 bg-emerald-50/50 rounded-xl border border-emerald-100 text-xs text-slate-800 flex items-start space-x-2">
                    <span className="text-emerald-600 font-bold">•</span>
                    <span>{sim}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Key Differences */}
            <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm space-y-3">
              <h3 className="font-bold text-xs uppercase tracking-wider text-amber-700 flex items-center space-x-2">
                <AlertTriangle className="w-4 h-4 text-amber-600" />
                <span>Critical Deviations & Differences</span>
              </h3>
              <ul className="space-y-2">
                {comparisonResult.comparison?.differences?.map((diff, idx) => (
                  <li key={idx} className="p-3 bg-amber-50/50 rounded-xl border border-amber-100 text-xs text-slate-800 flex items-start space-x-2">
                    <span className="text-amber-600 font-bold">•</span>
                    <span>{diff}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Exclusive Clauses Breakdown */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Exclusive to Doc 1 */}
            <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm space-y-3">
              <div className="flex items-center space-x-2 text-xs font-bold text-slate-900 border-b border-slate-100 pb-2">
                <MinusCircle className="w-4 h-4 text-red-500" />
                <span>Clauses Exclusive to {comparisonResult.doc1.name}</span>
              </div>
              <div className="space-y-2">
                {comparisonResult.comparison?.doc1OnlyClauses?.map((c, idx) => (
                  <div key={idx} className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs space-y-1">
                    <p className="font-bold text-slate-800">{c.title}</p>
                    <p className="text-[11px] text-slate-500">{c.explanation}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Exclusive to Doc 2 */}
            <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm space-y-3">
              <div className="flex items-center space-x-2 text-xs font-bold text-slate-900 border-b border-slate-100 pb-2">
                <PlusCircle className="w-4 h-4 text-emerald-500" />
                <span>Clauses Exclusive to {comparisonResult.doc2.name}</span>
              </div>
              <div className="space-y-2">
                {comparisonResult.comparison?.doc2OnlyClauses?.map((c, idx) => (
                  <div key={idx} className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs space-y-1">
                    <p className="font-bold text-slate-800">{c.title}</p>
                    <p className="text-[11px] text-slate-500">{c.explanation}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Payment and Termination Shifts */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm space-y-2">
              <h4 className="font-bold text-xs uppercase tracking-wider text-slate-700">Payment & Commercial Term Changes</h4>
              <p className="text-xs text-slate-600 leading-relaxed bg-slate-50 p-3 rounded-xl border border-slate-100">
                {comparisonResult.comparison?.paymentDifferences || 'No significant payment differences.'}
              </p>
            </div>

            <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm space-y-2">
              <h4 className="font-bold text-xs uppercase tracking-wider text-slate-700">Termination & Cancellation Condition Changes</h4>
              <p className="text-xs text-slate-600 leading-relaxed bg-slate-50 p-3 rounded-xl border border-slate-100">
                {comparisonResult.comparison?.terminationDifferences || 'No significant termination differences.'}
              </p>
            </div>
          </div>

          {/* Risk Shift Verdict */}
          {comparisonResult.comparison?.riskShift && (
            <div className="p-5 rounded-2xl bg-brand-50/70 border border-brand-200 flex items-start space-x-3 text-brand-950">
              <ShieldAlert className="w-5 h-5 text-brand-600 shrink-0 mt-0.5" />
              <div className="space-y-1">
                <h4 className="font-bold text-xs uppercase tracking-wider">Risk Profile & Liability Shift Assessment</h4>
                <p className="text-xs leading-relaxed text-slate-700">
                  {comparisonResult.comparison.riskShift}
                </p>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
