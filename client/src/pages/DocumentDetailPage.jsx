import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import {
  FileText,
  Sparkles,
  AlertTriangle,
  Tags,
  MessageSquare,
  Calendar,
  FileDown,
  ArrowLeft,
  Copy,
  Check,
  RefreshCw,
  Download,
  Trash2,
  Loader2,
  AlertCircle,
  CheckCircle2,
  FileCode,
  Search,
  Languages,
} from 'lucide-react';
import api, { API_BASE_URL } from '../services/api';
import { useAuth } from '../context/AuthContext';

// Subviews
import { SummaryView } from '../components/analysis/SummaryView';
import { RiskScannerView } from '../components/analysis/RiskScannerView';
import { ClauseCategorizationView } from '../components/analysis/ClauseCategorizationView';
import { BilingualExplainView } from '../components/analysis/BilingualExplainView';
import { DocumentChatView } from '../components/analysis/DocumentChatView';
import { DocumentObligationsView } from '../components/analysis/DocumentObligationsView';
import { AuditReportView } from '../components/analysis/AuditReportView';

export const DocumentDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { hasValidAiKey } = useAuth();

  const [document, setDocument] = useState(null);
  const [analysis, setAnalysis] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('summary');
  const [copied, setCopied] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [reprocessing, setReprocessing] = useState(false);

  const fetchDocument = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await api.get(`/documents/${id}`);
      if (res.data?.success) {
        setDocument(res.data.data);
      }
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Failed to fetch document');
    } finally {
      setLoading(false);
    }
  };

  const fetchAnalysis = async () => {
    try {
      const res = await api.get(`/analysis/${id}`);
      if (res.data?.success && res.data.data) {
        setAnalysis(res.data.data);
      }
    } catch (err) {
      // Analysis not yet run or empty
    }
  };

  useEffect(() => {
    fetchDocument();
    fetchAnalysis();
  }, [id]);

  const handleCopyText = () => {
    if (document?.extractedText) {
      navigator.clipboard.writeText(document.extractedText);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleReprocess = async () => {
    setReprocessing(true);
    try {
      const res = await api.post(`/documents/${id}/reprocess`);
      if (res.data?.success) {
        setDocument(res.data.data);
      }
    } catch (err) {
      alert(err.response?.data?.message || err.message || 'Reprocessing failed');
    } finally {
      setReprocessing(false);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm(`Are you sure you want to permanently delete "${document.originalName}"?`)) {
      return;
    }
    try {
      await api.delete(`/documents/${id}`);
      navigate('/documents');
    } catch (err) {
      alert(err.response?.data?.message || err.message || 'Deletion failed');
    }
  };

  const handleAnalysisUpdated = (newAnalysis) => {
    setAnalysis(newAnalysis);
    setDocument((prev) => ({
      ...prev,
      analysisStatus: 'completed',
      documentType: newAnalysis.documentType,
    }));
  };

  if (loading) {
    return (
      <div className="py-24 text-center space-y-3">
        <Loader2 className="w-8 h-8 animate-spin text-brand-600 mx-auto" />
        <p className="text-xs text-slate-500 font-medium">Loading document and analysis data...</p>
      </div>
    );
  }

  if (error || !document) {
    return (
      <div className="p-8 text-center space-y-4 bg-white rounded-3xl border border-slate-200">
        <AlertCircle className="w-10 h-10 text-red-500 mx-auto" />
        <h2 className="text-lg font-bold text-slate-900">Document Unavailable</h2>
        <p className="text-xs text-slate-500 max-w-md mx-auto">{error || 'Document could not be located.'}</p>
        <Link
          to="/documents"
          className="inline-flex items-center space-x-2 px-4 py-2 bg-brand-600 text-white rounded-xl text-xs font-semibold"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Documents</span>
        </Link>
      </div>
    );
  }

  const wordCount = document.extractedText?.split(/\s+/).filter(Boolean).length || 0;
  const charCount = document.extractedText?.length || 0;

  const tabs = [
    { id: 'summary', label: 'AI Legal Summary', icon: Sparkles },
    { id: 'risks', label: 'Risks & Suspicious', icon: AlertTriangle },
    { id: 'clauses', label: 'Clause Categories', icon: Tags },
    { id: 'chat', label: 'Document Chat', icon: MessageSquare },
    { id: 'explain', label: 'English & Hindi', icon: Languages },
    { id: 'obligations', label: 'Obligations & Deadlines', icon: Calendar },
    { id: 'text', label: 'Extracted Text', icon: FileText },
    { id: 'report', label: 'PDF Report', icon: FileDown },
  ];

  return (
    <div className="space-y-6 pb-16">
      {/* Top back navigation and quick action toolbar */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <Link
          to="/documents"
          className="inline-flex items-center space-x-1.5 text-xs font-medium text-slate-500 hover:text-slate-900 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Repository</span>
        </Link>

        <div className="flex items-center space-x-2">
          <button
            onClick={handleReprocess}
            disabled={reprocessing}
            className="px-3 py-1.5 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 rounded-xl text-xs font-medium flex items-center space-x-1.5 transition-colors"
            title="Re-run PDF text extraction / OCR"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${reprocessing ? 'animate-spin' : ''}`} />
            <span>{reprocessing ? 'Reprocessing...' : 'Reprocess'}</span>
          </button>

          <a
            href={`${API_BASE_URL}/documents/${document._id}/download`}
            download
            className="px-3 py-1.5 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 rounded-xl text-xs font-medium flex items-center space-x-1.5 transition-colors"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Download PDF</span>
          </a>

          <button
            onClick={handleDelete}
            className="p-1.5 bg-white border border-slate-200 hover:bg-red-50 text-slate-500 hover:text-red-600 rounded-xl transition-colors"
            title="Delete Document"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Document Overview Header Card */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-start space-x-3.5 min-w-0">
            <div className="w-12 h-12 rounded-2xl bg-brand-50 text-brand-600 flex items-center justify-center shrink-0 shadow-sm">
              <FileText className="w-6 h-6" />
            </div>
            <div className="min-w-0">
              <div className="flex items-center space-x-2">
                <h1 className="text-lg font-bold text-slate-900 truncate" title={document.originalName}>
                  {document.originalName}
                </h1>
                <span className={`text-[10px] font-semibold px-2.5 py-0.5 rounded-full uppercase tracking-wider ${
                  document.processingStatus === 'completed'
                    ? 'bg-emerald-100 text-emerald-800'
                    : 'bg-amber-100 text-amber-800'
                }`}>
                  {document.processingStatus}
                </span>
              </div>
              <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500 mt-1 font-mono">
                <span>{(document.fileSize / (1024 * 1024)).toFixed(2)} MB</span>
                <span>•</span>
                <span>{document.pageCount} {document.pageCount === 1 ? 'Page' : 'Pages'}</span>
                <span>•</span>
                <span>{wordCount} Words</span>
                <span>•</span>
                <span className="text-brand-600 font-semibold uppercase">{document.extractionMethod?.replace('_', ' ')}</span>
              </div>
            </div>
          </div>

          {/* AI Trigger / Status Indicator */}
          <div className="flex items-center space-x-2 shrink-0">
            {analysis?.status === 'completed' ? (
              <span className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-emerald-50 text-emerald-700 border border-emerald-200 text-xs font-semibold">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>AI Audit Active</span>
              </span>
            ) : (
              <button
                onClick={() => setActiveTab('summary')}
                className="px-4 py-2 bg-gradient-to-r from-brand-600 to-indigo-600 hover:from-brand-700 hover:to-indigo-700 text-white rounded-xl text-xs font-semibold shadow-md flex items-center space-x-2 transition-all hover:scale-105"
              >
                <Sparkles className="w-4 h-4 text-brand-200" />
                <span>Run AI Legal Audit</span>
              </button>
            )}
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex items-center space-x-1 overflow-x-auto border-t border-slate-100 pt-4 scrollbar-none">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isCurrent = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-3.5 py-2 rounded-xl text-xs font-medium flex items-center space-x-1.5 whitespace-nowrap transition-all ${
                  isCurrent
                    ? 'bg-slate-900 text-white font-semibold shadow-sm'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Tab Views */}
      <div className="space-y-4">
        {/* Tab 1: AI Legal Summary */}
        {activeTab === 'summary' && (
          <SummaryView
            document={document}
            analysis={analysis}
            onAnalysisUpdated={handleAnalysisUpdated}
            onNavigateTab={setActiveTab}
          />
        )}

        {/* Tab 2: Risks & Suspicious Scanner */}
        {activeTab === 'risks' && (
          <RiskScannerView analysis={analysis} />
        )}

        {/* Tab 3: Clause Categories */}
        {activeTab === 'clauses' && (
          <ClauseCategorizationView analysis={analysis} />
        )}

        {/* Tab 4: AI Grounded Chat */}
        {activeTab === 'chat' && (
          <DocumentChatView document={document} />
        )}

        {/* Tab 5: English & Hindi Explanations */}
        {activeTab === 'explain' && (
          <BilingualExplainView analysis={analysis} />
        )}

        {/* Tab 6: Obligations & Deadlines */}
        {activeTab === 'obligations' && (
          <DocumentObligationsView document={document} analysis={analysis} />
        )}

        {/* Tab 7: Extracted Text Reader */}
        {activeTab === 'text' && (
          <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="p-4 sm:px-6 bg-slate-50 border-b border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="flex items-center space-x-3">
                <FileCode className="w-4 h-4 text-brand-600" />
                <h3 className="font-bold text-xs uppercase tracking-wider text-slate-800">
                  Extracted Document Corpus ({charCount} Characters)
                </h3>
              </div>

              <div className="flex items-center space-x-2">
                <div className="relative">
                  <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2" />
                  <input
                    type="text"
                    placeholder="Search in text..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-8 pr-3 py-1 text-xs bg-white border border-slate-200 rounded-lg outline-none focus:ring-1 focus:ring-brand-500 w-44"
                  />
                </div>

                <button
                  onClick={handleCopyText}
                  className="px-3 py-1 bg-white border border-slate-200 hover:bg-slate-100 text-slate-700 rounded-lg text-xs font-medium flex items-center space-x-1 transition-colors"
                >
                  {copied ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-600" />
                      <span className="text-emerald-600">Copied</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5 text-slate-500" />
                      <span>Copy Text</span>
                    </>
                  )}
                </button>
              </div>
            </div>

            <div className="p-6">
              {document.extractedText ? (
                <div className="font-mono text-xs leading-relaxed text-slate-800 whitespace-pre-wrap max-h-[600px] overflow-y-auto p-4 bg-slate-50/70 rounded-2xl border border-slate-200">
                  {document.extractedText}
                </div>
              ) : (
                <div className="py-12 text-center text-xs text-slate-400">
                  No text extracted. Try clicking &quot;Reprocess&quot; to re-run extraction.
                </div>
              )}
            </div>
          </div>
        )}

        {/* Tab 8: Downloadable Audit Report */}
        {activeTab === 'report' && (
          <AuditReportView document={document} analysis={analysis} />
        )}
      </div>
    </div>
  );
};
