import React, { useState, useEffect } from 'react';
import { Calendar, CheckCircle2, Clock, AlertCircle, Plus, Loader2, ArrowRight } from 'lucide-react';
import api from '../../services/api';

export const DocumentObligationsView = ({ document, analysis }) => {
  const [obligations, setObligations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState(null);

  const fetchObligations = async () => {
    setLoading(true);
    try {
      const res = await api.get('/obligations', {
        params: { documentId: document._id },
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

  useEffect(() => {
    fetchObligations();
  }, [document._id]);

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

  if (loading) {
    return (
      <div className="py-20 text-center space-y-2">
        <Loader2 className="w-6 h-6 animate-spin text-brand-600 mx-auto" />
        <p className="text-xs text-slate-500 font-medium">Loading extracted obligations...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h3 className="font-bold text-sm text-slate-900">Contractual Obligations & Key Deadlines</h3>
          <p className="text-xs text-slate-500">
            Commitments extracted by Gemini AI with responsible parties and due dates
          </p>
        </div>

        <span className="text-xs font-mono font-semibold px-3 py-1 bg-brand-50 text-brand-700 rounded-xl self-start sm:self-auto">
          {obligations.filter((o) => o.status === 'Pending').length} Pending • {obligations.filter((o) => o.status === 'Completed').length} Completed
        </span>
      </div>

      <div className="space-y-3">
        {obligations.length > 0 ? (
          obligations.map((ob) => {
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
                  <div className="flex items-center space-x-2">
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
                    <h4 className={`font-bold text-xs ${isCompleted ? 'line-through text-slate-500' : 'text-slate-900'}`}>
                      {ob.title}
                    </h4>
                  </div>

                  <p className="text-xs text-slate-600 leading-relaxed">{ob.description}</p>

                  <div className="flex flex-wrap items-center gap-3 text-[11px] text-slate-500 font-mono">
                    <span>Party: <strong className="text-slate-800">{ob.responsibleParty}</strong></span>
                    <span>•</span>
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3 text-slate-400" />
                      <span>Due: <strong className="text-brand-700">{ob.dueDateRaw || 'Specified in text'}</strong></span>
                    </span>
                    {ob.sectionOrPage && (
                      <>
                        <span>•</span>
                        <span>Ref: {ob.sectionOrPage}</span>
                      </>
                    )}
                  </div>
                </div>

                <div className="shrink-0 self-end sm:self-center">
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
                    <span>{isCompleted ? 'Mark Pending' : 'Mark Completed'}</span>
                  </button>
                </div>
              </div>
            );
          })
        ) : (
          <div className="py-12 bg-white rounded-3xl border border-slate-200 text-center text-xs text-slate-500">
            No explicit obligations identified. Please run AI Legal Analysis to extract commitments and deadlines.
          </div>
        )}
      </div>
    </div>
  );
};
