import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Calendar,
  CheckCircle2,
  Clock,
  AlertTriangle,
  Plus,
  Filter,
  FileText,
  Loader2,
  Trash2,
  ArrowRight,
  Check,
} from 'lucide-react';
import api from '../services/api';

export const ObligationsPage = () => {
  const [obligations, setObligations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('all');
  const [priorityFilter, setPriorityFilter] = useState('all');
  const [updatingId, setUpdatingId] = useState(null);

  // Manual Add Modal State
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [documents, setDocuments] = useState([]);
  const [newTitle, setNewTitle] = useState('');
  const [newDocId, setNewDocId] = useState('');
  const [newParty, setNewParty] = useState('');
  const [newDueDate, setNewDueDate] = useState('');
  const [newPriority, setNewPriority] = useState('Medium');
  const [submitting, setSubmitting] = useState(false);

  const fetchObligations = async () => {
    setLoading(true);
    try {
      const res = await api.get('/obligations', {
        params: {
          status: statusFilter !== 'all' ? statusFilter : undefined,
          priority: priorityFilter !== 'all' ? priorityFilter : undefined,
        },
      });
      if (res.data?.success) {
        setObligations(res.data.data.obligations || []);
      }
    } catch (err) {
      console.warn('Failed to fetch obligations:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchUserDocs = async () => {
    try {
      const res = await api.get('/documents');
      if (res.data?.success) {
        setDocuments(res.data.data.documents || []);
        if (res.data.data.documents?.length > 0) {
          setNewDocId(res.data.data.documents[0]._id);
        }
      }
    } catch (err) {}
  };

  useEffect(() => {
    fetchObligations();
  }, [statusFilter, priorityFilter]);

  const handleToggleStatus = async (ob) => {
    setUpdatingId(ob._id);
    const nextStatus = ob.status === 'Completed' ? 'Pending' : 'Completed';
    try {
      const res = await api.put(`/obligations/${ob._id}/status`, { status: nextStatus });
      if (res.data?.success) {
        setObligations((prev) =>
          prev.map((item) => (item._id === ob._id ? { ...item, status: nextStatus } : item))
        );
      }
    } catch (err) {
      alert('Failed to update status');
    } finally {
      setUpdatingId(null);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this obligation record?')) return;
    try {
      await api.delete(`/obligations/${id}`);
      setObligations((prev) => prev.filter((o) => o._id !== id));
    } catch (err) {
      alert('Failed to delete obligation');
    }
  };

  const handleAddSubmit = async (e) => {
    e.preventDefault();
    if (!newTitle.trim() || !newDocId) return;

    setSubmitting(true);
    try {
      const res = await api.post('/obligations', {
        documentId: newDocId,
        title: newTitle.trim(),
        responsibleParty: newParty.trim() || 'Specified Party',
        dueDate: newDueDate || null,
        priority: newPriority,
      });

      if (res.data?.success) {
        setIsAddModalOpen(false);
        setNewTitle('');
        setNewParty('');
        setNewDueDate('');
        fetchObligations();
      }
    } catch (err) {
      alert(err.response?.data?.message || err.message || 'Failed to create obligation');
    } finally {
      setSubmitting(false);
    }
  };

  const pendingCount = obligations.filter((o) => o.status === 'Pending').length;
  const completedCount = obligations.filter((o) => o.status === 'Completed').length;

  return (
    <div className="space-y-6 pb-16">
      {/* Header and Add Button */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">Obligations & Deadlines</h1>
          <p className="text-xs text-slate-500 mt-1">
            Track contractual commitments, notice deadlines, and payment milestones across all agreements.
          </p>
        </div>

        <button
          onClick={() => {
            fetchUserDocs();
            setIsAddModalOpen(true);
          }}
          className="px-4 py-2.5 bg-brand-600 hover:bg-brand-700 text-white rounded-xl text-xs font-semibold shadow-sm flex items-center space-x-2 self-start sm:self-auto transition-all"
        >
          <Plus className="w-4 h-4" />
          <span>Add Custom Obligation</span>
        </button>
      </div>

      {/* Filter and Metric Toolbar */}
      <div className="bg-white p-4 rounded-3xl border border-slate-200 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center space-x-2 w-full sm:w-auto overflow-x-auto pb-1 sm:pb-0">
          <span className="text-xs font-semibold text-slate-500">Status:</span>
          {['all', 'Pending', 'Completed'].map((st) => (
            <button
              key={st}
              onClick={() => setStatusFilter(st)}
              className={`px-3 py-1.5 rounded-xl text-xs font-medium capitalize transition-colors ${
                statusFilter === st
                  ? 'bg-brand-600 text-white font-semibold'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {st} {st === 'Pending' ? `(${pendingCount})` : st === 'Completed' ? `(${completedCount})` : ''}
            </button>
          ))}
        </div>

        <div className="flex items-center space-x-2 self-end sm:self-auto">
          <span className="text-xs font-semibold text-slate-500">Priority:</span>
          {['all', 'High', 'Medium', 'Low'].map((pr) => (
            <button
              key={pr}
              onClick={() => setPriorityFilter(pr)}
              className={`px-2.5 py-1 rounded-lg text-xs font-medium capitalize transition-colors ${
                priorityFilter === pr
                  ? 'bg-slate-900 text-white font-semibold'
                  : 'text-slate-500 hover:bg-slate-100'
              }`}
            >
              {pr}
            </button>
          ))}
        </div>
      </div>

      {/* Obligations List */}
      {loading ? (
        <div className="py-20 text-center space-y-2">
          <Loader2 className="w-8 h-8 animate-spin text-brand-600 mx-auto" />
          <p className="text-xs text-slate-500 font-medium">Loading obligations and deadlines...</p>
        </div>
      ) : obligations.length > 0 ? (
        <div className="space-y-3">
          {obligations.map((ob) => {
            const isCompleted = ob.status === 'Completed';
            const isUpdating = updatingId === ob._id;

            return (
              <div
                key={ob._id}
                className={`bg-white rounded-2xl border p-5 shadow-sm transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4 ${
                  isCompleted ? 'border-emerald-200 bg-emerald-50/20 opacity-80' : 'border-slate-200'
                }`}
              >
                <div className="space-y-2 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider ${
                        ob.priority === 'High'
                          ? 'bg-red-100 text-red-800'
                          : ob.priority === 'Medium'
                          ? 'bg-amber-100 text-amber-800'
                          : 'bg-slate-100 text-slate-700'
                      }`}
                    >
                      {ob.priority} Priority
                    </span>

                    {ob.documentId && (
                      <Link
                        to={`/documents/${ob.documentId._id || ob.documentId}`}
                        className="inline-flex items-center space-x-1 text-[11px] font-mono font-medium text-brand-600 hover:text-brand-800 hover:underline"
                      >
                        <FileText className="w-3 h-3" />
                        <span className="truncate max-w-[200px]">{ob.documentId.originalName || 'Contract'}</span>
                      </Link>
                    )}
                  </div>

                  <h3 className={`font-bold text-xs ${isCompleted ? 'line-through text-slate-500' : 'text-slate-900'}`}>
                    {ob.title}
                  </h3>

                  <p className="text-xs text-slate-600 leading-relaxed">{ob.description}</p>

                  <div className="flex flex-wrap items-center gap-3 text-[11px] text-slate-500 font-mono">
                    <span>Party: <strong className="text-slate-800">{ob.responsibleParty}</strong></span>
                    <span>•</span>
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3 text-slate-400" />
                      <span>Due: <strong className="text-brand-700">{ob.dueDateRaw || (ob.dueDate ? new Date(ob.dueDate).toLocaleDateString() : 'Conditional')}</strong></span>
                    </span>
                    {ob.sectionOrPage && (
                      <>
                        <span>•</span>
                        <span>Ref: {ob.sectionOrPage}</span>
                      </>
                    )}
                  </div>
                </div>

                <div className="flex items-center space-x-2 shrink-0 self-end sm:self-center">
                  <button
                    onClick={() => handleToggleStatus(ob)}
                    disabled={isUpdating}
                    className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold flex items-center space-x-1.5 transition-all ${
                      isCompleted
                        ? 'bg-emerald-100 text-emerald-800 hover:bg-emerald-200'
                        : 'bg-slate-100 hover:bg-brand-50 hover:text-brand-700 text-slate-700'
                    }`}
                  >
                    <CheckCircle2 className={`w-3.5 h-3.5 ${isCompleted ? 'text-emerald-600' : 'text-slate-400'}`} />
                    <span>{isCompleted ? 'Completed' : 'Mark Done'}</span>
                  </button>

                  <button
                    onClick={() => handleDelete(ob._id)}
                    className="p-1.5 text-slate-400 hover:text-red-600 rounded-lg hover:bg-red-50 transition-colors"
                    title="Delete Obligation"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="py-16 bg-white rounded-3xl border border-slate-200 text-center space-y-3 shadow-sm">
          <div className="w-12 h-12 rounded-2xl bg-slate-100 text-slate-400 flex items-center justify-center mx-auto">
            <Calendar className="w-6 h-6" />
          </div>
          <div>
            <h4 className="font-bold text-slate-800 text-sm">No obligations found</h4>
            <p className="text-xs text-slate-500 max-w-sm mx-auto mt-1">
              Upload contracts and run AI legal analysis to automatically extract contractual commitments and deadlines.
            </p>
          </div>
        </div>
      )}

      {/* Add Custom Obligation Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4">
          <div className="bg-white rounded-3xl shadow-xl border border-slate-200 w-full max-w-lg p-6 space-y-4">
            <h3 className="font-bold text-sm text-slate-900">Add Contractual Obligation</h3>

            <form onSubmit={handleAddSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">
                  Associated Document
                </label>
                <select
                  value={newDocId}
                  onChange={(e) => setNewDocId(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-brand-500 outline-none"
                >
                  {documents.map((d) => (
                    <option key={d._id} value={d._id}>
                      {d.originalName}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">
                  Obligation Title / Action
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Deposit remaining security balance"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-brand-500 outline-none"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">
                    Responsible Party
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Tenant, Contractor"
                    value={newParty}
                    onChange={(e) => setNewParty(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-brand-500 outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">
                    Priority
                  </label>
                  <select
                    value={newPriority}
                    onChange={(e) => setNewPriority(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-brand-500 outline-none"
                  >
                    <option value="High">High Priority</option>
                    <option value="Medium">Medium Priority</option>
                    <option value="Low">Low Priority</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">
                  Target Due Date (Optional)
                </label>
                <input
                  type="date"
                  value={newDueDate}
                  onChange={(e) => setNewDueDate(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-brand-500 outline-none"
                />
              </div>

              <div className="flex justify-end space-x-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2 text-xs font-medium text-slate-600 hover:text-slate-900"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-5 py-2.5 bg-brand-600 hover:bg-brand-700 text-white rounded-xl text-xs font-semibold shadow-sm"
                >
                  {submitting ? 'Creating...' : 'Create Obligation'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
