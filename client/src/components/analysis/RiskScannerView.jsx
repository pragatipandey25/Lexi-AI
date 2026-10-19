import React, { useState } from 'react';
import {
  AlertTriangle,
  ShieldAlert,
  HelpCircle,
  CheckCircle2,
  Filter,
  ArrowRight,
  Scale,
  FileSearch,
  Quote,
} from 'lucide-react';

export const RiskScannerView = ({ analysis }) => {
  const [categoryFilter, setCategoryFilter] = useState('all'); // 'all' | 'legal_risk' | 'suspicious'
  const [severityFilter, setSeverityFilter] = useState('all'); // 'all' | 'High' | 'Medium' | 'Low'

  if (!analysis || !analysis.risks || analysis.risks.length === 0) {
    return (
      <div className="bg-white rounded-3xl border border-slate-200 p-12 text-center space-y-4 shadow-sm">
        <div className="w-16 h-16 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto">
          <CheckCircle2 className="w-8 h-8" />
        </div>
        <div>
          <h3 className="font-bold text-slate-900 text-base">No Risk Alerts Flagged</h3>
          <p className="text-xs text-slate-500 max-w-md mx-auto mt-1">
            Either the document has not yet been audited by AI, or no critical legal risks or suspicious anomalies were identified.
          </p>
        </div>
      </div>
    );
  }

  const risks = analysis.risks;

  const highCount = risks.filter((r) => r.severity === 'High').length;
  const mediumCount = risks.filter((r) => r.severity === 'Medium').length;
  const lowCount = risks.filter((r) => r.severity === 'Low').length;
  const suspiciousCount = risks.filter((r) => r.type === 'suspicious').length;
  const legalRiskCount = risks.filter((r) => r.type === 'legal_risk').length;

  const filteredRisks = risks.filter((r) => {
    if (categoryFilter !== 'all' && r.type !== categoryFilter) return false;
    if (severityFilter !== 'all' && r.severity !== severityFilter) return false;
    return true;
  });

  return (
    <div className="space-y-6">
      {/* Metric summary chips */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="p-4 bg-red-50/80 border border-red-200 rounded-2xl text-red-950 flex items-center justify-between">
          <div>
            <p className="text-[11px] font-bold uppercase tracking-wider text-red-600">High Severity</p>
            <h3 className="text-2xl font-extrabold mt-0.5">{highCount}</h3>
          </div>
          <div className="w-9 h-9 rounded-xl bg-red-200/60 text-red-700 flex items-center justify-center">
            <ShieldAlert className="w-5 h-5" />
          </div>
        </div>

        <div className="p-4 bg-amber-50/80 border border-amber-200 rounded-2xl text-amber-950 flex items-center justify-between">
          <div>
            <p className="text-[11px] font-bold uppercase tracking-wider text-amber-600">Medium Severity</p>
            <h3 className="text-2xl font-extrabold mt-0.5">{mediumCount}</h3>
          </div>
          <div className="w-9 h-9 rounded-xl bg-amber-200/60 text-amber-700 flex items-center justify-center">
            <AlertTriangle className="w-5 h-5" />
          </div>
        </div>

        <div className="p-4 bg-purple-50/80 border border-purple-200 rounded-2xl text-purple-950 flex items-center justify-between">
          <div>
            <p className="text-[11px] font-bold uppercase tracking-wider text-purple-600">Suspicious Anomalies</p>
            <h3 className="text-2xl font-extrabold mt-0.5">{suspiciousCount}</h3>
          </div>
          <div className="w-9 h-9 rounded-xl bg-purple-200/60 text-purple-700 flex items-center justify-center">
            <FileSearch className="w-5 h-5" />
          </div>
        </div>

        <div className="p-4 bg-emerald-50/80 border border-emerald-200 rounded-2xl text-emerald-950 flex items-center justify-between">
          <div>
            <p className="text-[11px] font-bold uppercase tracking-wider text-emerald-600">Low Severity</p>
            <h3 className="text-2xl font-extrabold mt-0.5">{lowCount}</h3>
          </div>
          <div className="w-9 h-9 rounded-xl bg-emerald-200/60 text-emerald-700 flex items-center justify-center">
            <CheckCircle2 className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* Filter Toolbar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
        {/* Category Filters */}
        <div className="flex items-center space-x-1.5 w-full sm:w-auto overflow-x-auto pb-1 sm:pb-0">
          <span className="text-xs text-slate-500 font-semibold mr-1">Category:</span>
          <button
            onClick={() => setCategoryFilter('all')}
            className={`px-3 py-1.5 rounded-xl text-xs font-medium transition-colors ${
              categoryFilter === 'all'
                ? 'bg-slate-900 text-white'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            All ({risks.length})
          </button>
          <button
            onClick={() => setCategoryFilter('legal_risk')}
            className={`px-3 py-1.5 rounded-xl text-xs font-medium transition-colors ${
              categoryFilter === 'legal_risk'
                ? 'bg-brand-600 text-white'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            Legal Risks ({legalRiskCount})
          </button>
          <button
            onClick={() => setCategoryFilter('suspicious')}
            className={`px-3 py-1.5 rounded-xl text-xs font-medium transition-colors ${
              categoryFilter === 'suspicious'
                ? 'bg-purple-600 text-white'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            Suspicious Indicators ({suspiciousCount})
          </button>
        </div>

        {/* Severity Filters */}
        <div className="flex items-center space-x-1.5 self-end sm:self-auto">
          <span className="text-xs text-slate-500 font-semibold mr-1">Severity:</span>
          {['all', 'High', 'Medium', 'Low'].map((sev) => (
            <button
              key={sev}
              onClick={() => setSeverityFilter(sev)}
              className={`px-2.5 py-1 rounded-lg text-xs font-medium capitalize transition-colors ${
                severityFilter === sev
                  ? 'bg-brand-100 text-brand-800 font-semibold'
                  : 'text-slate-500 hover:bg-slate-100'
              }`}
            >
              {sev}
            </button>
          ))}
        </div>
      </div>

      {/* Important Disclaimer Notice */}
      <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl flex items-start space-x-3 text-xs text-slate-600">
        <Scale className="w-4 h-4 text-brand-600 shrink-0 mt-0.5" />
        <p className="leading-relaxed">
          <strong>Review Guidance:</strong> LexiAI flags potentially unfavorable terms, one-sided provisions, and text inconsistencies for closer inspection. These diagnostic alerts are informational pointers grounded in the contract text and do not classify any document as illegal or fraudulent. Always consult a qualified lawyer.
        </p>
      </div>

      {/* Risk Cards List */}
      <div className="space-y-4">
        {filteredRisks.length > 0 ? (
          filteredRisks.map((risk, idx) => {
            const isHigh = risk.severity === 'High';
            const isMedium = risk.severity === 'Medium';
            const isSuspicious = risk.type === 'suspicious';

            return (
              <div
                key={idx}
                className={`bg-white rounded-2xl border p-5 shadow-sm space-y-3.5 transition-all ${
                  isHigh
                    ? 'border-red-200 hover:border-red-300'
                    : isMedium
                    ? 'border-amber-200 hover:border-amber-300'
                    : 'border-slate-200'
                }`}
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div className="flex items-center space-x-2.5">
                    <div
                      className={`p-1.5 rounded-lg ${
                        isHigh
                          ? 'bg-red-100 text-red-700'
                          : isMedium
                          ? 'bg-amber-100 text-amber-700'
                          : 'bg-emerald-100 text-emerald-700'
                      }`}
                    >
                      <AlertTriangle className="w-4 h-4" />
                    </div>
                    <h3 className="font-bold text-sm text-slate-900">{risk.title}</h3>
                  </div>

                  <div className="flex items-center space-x-2">
                    <span
                      className={`text-[10px] font-semibold px-2 py-0.5 rounded-full uppercase tracking-wider ${
                        isSuspicious
                          ? 'bg-purple-100 text-purple-800'
                          : 'bg-brand-100 text-brand-800'
                      }`}
                    >
                      {isSuspicious ? 'Suspicious Indicator' : 'Legal Risk'}
                    </span>

                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                        isHigh
                          ? 'bg-red-600 text-white'
                          : isMedium
                          ? 'bg-amber-500 text-white'
                          : 'bg-emerald-600 text-white'
                      }`}
                    >
                      {risk.severity} Severity
                    </span>
                  </div>
                </div>

                {/* Evidence Quote */}
                {risk.clauseText && (
                  <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs text-slate-700 space-y-1">
                    <div className="flex items-center justify-between text-[10px] font-mono font-semibold text-slate-500 uppercase">
                      <span className="flex items-center gap-1">
                        <Quote className="w-3 h-3 text-slate-400" /> Contract Evidence Excerpt
                      </span>
                      <span>{risk.sectionOrPage || 'Section Reference'}</span>
                    </div>
                    <p className="font-mono italic text-slate-800 text-[11px] leading-relaxed">
                      &quot;{risk.clauseText}&quot;
                    </p>
                  </div>
                )}

                {/* Why It Matters */}
                <div className="text-xs text-slate-700 space-y-1">
                  <span className="font-semibold text-slate-900 block">Why this matters:</span>
                  <p className="leading-relaxed text-slate-600">{risk.whyItMatters}</p>
                </div>

                {/* Recommended Action */}
                {risk.recommendedAction && (
                  <div className="p-3 rounded-xl bg-brand-50/60 border border-brand-100 text-xs text-brand-900 flex items-start space-x-2">
                    <ArrowRight className="w-4 h-4 text-brand-600 shrink-0 mt-0.5" />
                    <div>
                      <span className="font-semibold text-brand-950 block">Recommended Action:</span>
                      <p className="mt-0.5">{risk.recommendedAction}</p>
                    </div>
                  </div>
                )}
              </div>
            );
          })
        ) : (
          <div className="py-12 bg-white rounded-2xl border border-slate-200 text-center text-xs text-slate-500">
            No risks matched your selected filter criteria.
          </div>
        )}
      </div>
    </div>
  );
};
