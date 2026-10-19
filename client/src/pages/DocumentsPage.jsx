import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  FileText,
  Search,
  UploadCloud,
  MoreVertical,
  Trash2,
  Edit2,
  Download,
  Calendar,
  Layers,
  ArrowRight,
  AlertCircle,
  Loader2,
  CheckCircle2,
  Clock,
  RefreshCw,
  FileSearch,
} from 'lucide-react';
import api from '../services/api';

export const DocumentsPage = () => {
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [renameDoc, setRenameDoc] = useState(null);
  const [newName, setNewName] = useState('');
  const [deleteDoc, setDeleteDoc] = useState(null);
  const [actionLoading, setActionLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchDocuments = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await api.get('/documents', {
        params: {
          search: search || undefined,
          status: statusFilter !== 'all' ? statusFilter : undefined,
        },
      });
      if (res.data?.success) {
        setDocuments(res.data.data.documents || []);
      }
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Failed to load documents');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      fetchDocuments();
    }, 300);
    return () => clearTimeout(delayDebounce);
  }, [search, statusFilter]);

  const handleRenameSubmit = async (e) => {
    e.preventDefault();
    if (!renameDoc || !newName.trim()) return;

    setActionLoading(true);
    try {
      const res = await api.put(`/documents/${renameDoc._id}/rename`, { name: newName });
      if (res.data?.success) {
        setDocuments((prev) =>
          prev.map((doc) => (doc._id === renameDoc._id ? { ...doc, originalName: res.data.data.originalName } : doc))
        );
        setRenameDoc(null);
      }
    } catch (err) {
      alert(err.response?.data?.message || err.message || 'Rename failed');
    } finally {
      setActionLoading(false);
    }
  };

  const handleDeleteConfirm = async () => {
    if (!deleteDoc) return;

    setActionLoading(true);
    try {
      const res = await api.delete(`/documents/${deleteDoc._id}`);
      if (res.data?.success) {
        setDocuments((prev) => prev.filter((d) => d._id !== deleteDoc._id));
        setDeleteDoc(null);
      }
    } catch (err) {
      alert(err.response?.data?.message || err.message || 'Delete failed');
    } finally {
      setActionLoading(false);
    }
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header & Upload CTA */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">Contract Repository</h1>
          <p className="text-xs text-slate-500 mt-1">
            Browse, search, manage, and inspect all uploaded legal agreements and extracted text.
          </p>
        </div>

        <Link
          to="/upload"
          className="px-4 py-2.5 bg-brand-600 hover:bg-brand-700 text-white rounded-xl text-xs font-semibold shadow-sm hover:shadow-md transition-all flex items-center space-x-2 self-start sm:self-auto"
        >
          <UploadCloud className="w-4 h-4" />
          <span>Upload New Contract</span>
        </Link>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex flex-col sm:flex-row gap-3 items-center justify-between">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
          <input
            type="text"
            placeholder="Search by contract name..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-brand-500 outline-none"
          />
        </div>

        <div className="flex items-center space-x-2 w-full sm:w-auto overflow-x-auto pb-1 sm:pb-0">
          <span className="text-xs text-slate-500 font-medium whitespace-nowrap">Status:</span>
          {['all', 'completed', 'processing', 'failed'].map((st) => (
            <button
              key={st}
              onClick={() => setStatusFilter(st)}
              className={`px-3 py-1.5 rounded-xl text-xs font-medium capitalize whitespace-nowrap transition-colors ${
                statusFilter === st
                  ? 'bg-brand-600 text-white font-semibold'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {st}
            </button>
          ))}
          <button
            onClick={fetchDocuments}
            className="p-1.5 text-slate-500 hover:text-slate-900 rounded-lg hover:bg-slate-100 transition-colors"
            title="Refresh list"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Document List */}
      {loading ? (
        <div className="py-20 text-center space-y-3">
          <Loader2 className="w-8 h-8 animate-spin text-brand-600 mx-auto" />
          <p className="text-xs text-slate-500 font-medium">Loading documents...</p>
        </div>
      ) : documents.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {documents.map((doc) => (
            <div
              key={doc._id}
              className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm hover:shadow-md transition-all flex flex-col justify-between group"
            >
              <div className="space-y-3">
                <div className="flex items-start justify-between">
                  <div className="w-10 h-10 rounded-xl bg-brand-50 text-brand-600 flex items-center justify-center shrink-0">
                    <FileText className="w-5 h-5" />
                  </div>

                  <span
                    className={`text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-full ${
                      doc.processingStatus === 'completed'
                        ? 'bg-emerald-100 text-emerald-800'
                        : doc.processingStatus === 'failed'
                        ? 'bg-red-100 text-red-800'
                        : 'bg-amber-100 text-amber-800'
                    }`}
                  >
                    {doc.processingStatus}
                  </span>
                </div>

                <div>
                  <h3
                    className="font-bold text-sm text-slate-900 group-hover:text-brand-600 transition-colors line-clamp-1"
                    title={doc.originalName}
                  >
                    {doc.originalName}
                  </h3>
                  <div className="flex items-center space-x-3 text-[11px] text-slate-400 mt-1 font-mono">
                    <span>{(doc.fileSize / (1024 * 1024)).toFixed(2)} MB</span>
                    <span>•</span>
                    <span>{doc.pageCount || 1} {doc.pageCount === 1 ? 'page' : 'pages'}</span>
                    <span>•</span>
                    <span className="capitalize">{doc.extractionMethod?.replace('_', ' ') || 'PDF'}</span>
                  </div>
                </div>

                <div className="text-[11px] text-slate-400 flex items-center space-x-1.5 pt-1">
                  <Calendar className="w-3.5 h-3.5 text-slate-400" />
                  <span>Uploaded {new Date(doc.createdAt).toLocaleDateString()}</span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-4 mt-4 border-t border-slate-100 flex items-center justify-between">
                <div className="flex items-center space-x-1">
                  <button
                    onClick={() => {
                      setRenameDoc(doc);
                      setNewName(doc.originalName);
                    }}
                    className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-100 transition-colors"
                    title="Rename Document"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                  </button>

                  <a
                    href={`/api/documents/${doc._id}/download`}
                    download
                    className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-100 transition-colors"
                    title="Download Original PDF"
                  >
                    <Download className="w-3.5 h-3.5" />
                  </a>

                  <button
                    onClick={() => setDeleteDoc(doc)}
                    className="p-1.5 text-slate-400 hover:text-red-600 rounded-lg hover:bg-red-50 transition-colors"
                    title="Delete Document"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>

                <Link
                  to={`/documents/${doc._id}`}
                  className="inline-flex items-center space-x-1 text-xs font-semibold text-brand-600 hover:text-brand-700"
                >
                  <span>Open Analysis</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-3xl border border-slate-200 py-16 px-4 text-center space-y-4 shadow-sm">
          <div className="w-16 h-16 rounded-2xl bg-slate-100 text-slate-400 flex items-center justify-center mx-auto">
            <FileSearch className="w-8 h-8" />
          </div>
          <div>
            <h3 className="font-bold text-slate-800 text-base">No legal documents found</h3>
            <p className="text-xs text-slate-500 max-w-sm mx-auto mt-1">
              {search || statusFilter !== 'all'
                ? 'Try adjusting your search terms or filters.'
                : 'Upload your first contract or lease agreement in PDF format to begin automated analysis.'}
            </p>
          </div>
          <Link
            to="/upload"
            className="inline-flex items-center space-x-2 px-5 py-2.5 bg-brand-600 hover:bg-brand-700 text-white rounded-xl text-xs font-semibold shadow-sm transition-all"
          >
            <UploadCloud className="w-4 h-4" />
            <span>Upload Contract</span>
          </Link>
        </div>
      )}

      {/* Rename Modal */}
      {renameDoc && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl shadow-xl border border-slate-200 w-full max-w-md p-6 space-y-4">
            <h3 className="font-bold text-slate-900 text-sm">Rename Contract</h3>
            <form onSubmit={handleRenameSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">
                  Document Name
                </label>
                <input
                  type="text"
                  required
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-brand-500 outline-none"
                />
              </div>
              <div className="flex justify-end space-x-2 pt-2">
                <button
                  type="button"
                  onClick={() => setRenameDoc(null)}
                  className="px-4 py-2 text-xs font-medium text-slate-600 hover:text-slate-900"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={actionLoading}
                  className="px-4 py-2 bg-brand-600 hover:bg-brand-700 text-white text-xs font-semibold rounded-xl"
                >
                  {actionLoading ? 'Saving...' : 'Rename'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteDoc && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl shadow-xl border border-slate-200 w-full max-w-md p-6 space-y-4">
            <div className="flex items-center space-x-3 text-red-600">
              <div className="p-2 bg-red-100 rounded-xl">
                <Trash2 className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-slate-900 text-sm">Confirm Document Deletion</h3>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed">
              Are you sure you want to permanently delete <strong>{deleteDoc.originalName}</strong>? All extracted text, AI analyses, risk scores, and saved chat history will be removed.
            </p>
            <div className="flex justify-end space-x-2 pt-2">
              <button
                type="button"
                onClick={() => setDeleteDoc(null)}
                className="px-4 py-2 text-xs font-medium text-slate-600 hover:text-slate-900"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleDeleteConfirm}
                disabled={actionLoading}
                className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white text-xs font-semibold rounded-xl"
              >
                {actionLoading ? 'Deleting...' : 'Delete Permanently'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
