import React, { useState } from 'react';
import { FileDown, CheckCircle2, ShieldCheck, AlertCircle, Loader2, Sparkles, Scale } from 'lucide-react';
import api from '../../services/api';

export const AuditReportView = ({ document, analysis }) => {
  const [downloading, setDownloading] = useState(false);
  const [error, setError] = useState(null);

  const isAnalysisComplete = analysis && analysis.status === 'completed';

  const handleDownload = async () => {
    if (!isAnalysisComplete) return;

    setDownloading(true);
    setError(null);

    try {
      const response = await api.get(`/reports/${document._id}`, {
        responseType: 'blob',
      });

      // Create download link from blob
      const blob = new Blob([response.data], { type: 'application/pdf' });
      const url = window.URL.createObjectURL(blob);
      const link = window.document.createElement('a');
      link.href = url;
      link.download = `LexiAI_Audit_${document.originalName.replace(/[^a-zA-Z0-9_-]/g, '_')}.pdf`;
      window.document.body.appendChild(link);
      link.click();
      window.document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (err) {
      setError('Failed to download report. Ensure that AI analysis is completed.');
    } finally {
      setDownloading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div className="bg-white rounded-3xl border border-slate-200 p-8 shadow-sm space-y-6">
        <div className="flex items-center space-x-3.5">
          <div className="w-12 h-12 rounded-2xl bg-brand-50 text-brand-600 flex items-center justify-center shrink-0">
            <FileDown className="w-6 h-6" />
          </div>
          <div>
            <h3 className="font-extrabold text-slate-900 text-lg">Executive AI Legal Audit Report</h3>
            <p className="text-xs text-slate-500">
              Download a publication-quality, formatted PDF audit detailing all findings, risks, and obligations.
            </p>
          </div>
        </div>

        {error && (
          <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-red-700 text-xs flex items-center space-x-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Report Overview Checklist */}
        <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
          <p className="text-xs font-bold text-slate-800 uppercase tracking-wider">
            Included in the PDF Audit Report:
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-slate-700">
            <div className="flex items-center space-x-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
              <span>Full Executive Summary & Purpose</span>
            </div>
            <div className="flex items-center space-x-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
              <span>Risk & Suspicious Diagnostics (Ranked)</span>
            </div>
            <div className="flex items-center space-x-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
              <span>Exact Clause Quotations & Evidence</span>
            </div>
            <div className="flex items-center space-x-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
              <span>Plain-Language Translations</span>
            </div>
            <div className="flex items-center space-x-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
              <span>Obligation & Deadline Timetable</span>
            </div>
            <div className="flex items-center space-x-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
              <span>Recommended Review Actions & Counsel Notes</span>
            </div>
          </div>
        </div>

        {/* Download Trigger */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-2">
          <div className="flex items-center space-x-2 text-xs text-slate-500">
            <ShieldCheck className="w-4 h-4 text-brand-600" />
            <span>Generated live using PDFKit with AI legal disclaimers</span>
          </div>

          <button
            onClick={handleDownload}
            disabled={!isAnalysisComplete || downloading}
            className="w-full sm:w-auto px-7 py-3 bg-brand-600 hover:bg-brand-700 disabled:opacity-50 text-white font-semibold rounded-xl text-xs shadow-md shadow-brand-500/20 flex items-center justify-center space-x-2 transition-all hover:scale-105"
          >
            {downloading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Compiling PDF Report...</span>
              </>
            ) : (
              <>
                <FileDown className="w-4 h-4" />
                <span>Download PDF Audit Report</span>
              </>
            )}
          </button>
        </div>

        {!isAnalysisComplete && (
          <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl text-xs text-amber-800 flex items-start space-x-2">
            <AlertCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
            <p>
              Please run the <strong>AI Legal Analysis</strong> first to compile summary, risk, and clause findings before generating the report.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
