import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  FileText,
  UploadCloud,
  AlertTriangle,
  Calendar,
  CheckCircle,
  Clock,
  Sparkles,
  ArrowRight,
  ShieldAlert,
  GitCompare,
  Plus,
  BarChart3,
  PieChart as PieIcon,
  CheckCircle2,
  FileSearch,
} from 'lucide-react';
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
} from 'recharts';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';

export const DashboardPage = () => {
  const { user, hasValidAiKey } = useAuth();
  const [stats, setStats] = useState({
    totalDocuments: 0,
    analyzedDocuments: 0,
    highRiskCount: 0,
    mediumRiskCount: 0,
    lowRiskCount: 0,
    suspiciousCount: 0,
    pendingObligations: 0,
    completedObligations: 0,
    upcomingDeadlines: [],
    recentDocuments: [],
    riskDistribution: [],
    categoryBreakdown: [],
  });
  const [loading, setLoading] = useState(true);

  const fetchDashboardData = async () => {
    try {
      const res = await api.get('/dashboard');
      if (res.data?.success) {
        setStats(res.data.data);
      }
    } catch (err) {
      console.warn('Could not fetch dashboard stats:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const totalRisks = (stats.highRiskCount || 0) + (stats.mediumRiskCount || 0) + (stats.lowRiskCount || 0) + (stats.suspiciousCount || 0);

  const riskPieData = [
    { name: 'High Risk', value: stats.highRiskCount || 0, color: '#ef4444' },
    { name: 'Medium Risk', value: stats.mediumRiskCount || 0, color: '#f59e0b' },
    { name: 'Low Risk', value: stats.lowRiskCount || 0, color: '#10b981' },
    { name: 'Suspicious', value: stats.suspiciousCount || 0, color: '#8b5cf6' },
  ].filter((d) => d.value > 0);

  return (
    <div className="space-y-6 pb-16">
      {/* Welcome & Action Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
            Welcome back, {user?.name?.split(' ')[0] || 'Advocate'}
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            LexiAI Real-Time Command Center • Live Contract Audit Metrics & Deadline Tracking
          </p>
        </div>

        <div className="flex items-center space-x-3">
          <Link
            to="/upload"
            className="px-4 py-2.5 bg-brand-600 hover:bg-brand-700 text-white rounded-xl text-xs font-semibold shadow-sm hover:shadow-md transition-all flex items-center space-x-2"
          >
            <UploadCloud className="w-4 h-4" />
            <span>Upload Document</span>
          </Link>
        </div>
      </div>

      {/* AI Key Configuration Banner */}
      {!hasValidAiKey && (
        <div className="p-4 bg-amber-50 border border-amber-200 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-amber-900">
          <div className="flex items-start space-x-3">
            <Sparkles className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold text-xs text-amber-950">Gemini AI Engine Needs API Key</p>
              <p className="text-[11px] text-amber-700 mt-0.5">
                Configure your free Gemini API key to activate summaries, risk diagnostic scanning, and grounded Q&A.
              </p>
            </div>
          </div>
          <Link
            to="/settings"
            className="px-3.5 py-1.5 bg-amber-600 hover:bg-amber-700 text-white rounded-xl text-xs font-medium self-start sm:self-auto shrink-0 transition-colors"
          >
            Configure Key
          </Link>
        </div>
      )}

      {/* Metric Counters Grid (Actual Database Values) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Documents */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">Total Uploads</p>
            <h3 className="text-2xl font-extrabold text-slate-900 mt-1">{stats.totalDocuments}</h3>
            <p className="text-[11px] text-slate-400 mt-0.5">Contracts in library</p>
          </div>
          <div className="w-11 h-11 rounded-xl bg-slate-100 text-slate-600 flex items-center justify-center">
            <FileText className="w-5 h-5" />
          </div>
        </div>

        {/* Successfully Analyzed */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">AI Analyzed</p>
            <h3 className="text-2xl font-extrabold text-brand-600 mt-1">{stats.analyzedDocuments}</h3>
            <p className="text-[11px] text-emerald-600 mt-0.5 font-medium flex items-center gap-1">
              <CheckCircle className="w-3 h-3" /> Fully Audited
            </p>
          </div>
          <div className="w-11 h-11 rounded-xl bg-brand-50 text-brand-600 flex items-center justify-center">
            <Sparkles className="w-5 h-5" />
          </div>
        </div>

        {/* High Risk Findings */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-red-600">High Risks</p>
            <h3 className="text-2xl font-extrabold text-red-600 mt-1">{stats.highRiskCount}</h3>
            <p className="text-[11px] text-slate-400 mt-0.5">Critical clause alerts</p>
          </div>
          <div className="w-11 h-11 rounded-xl bg-red-50 text-red-600 flex items-center justify-center">
            <ShieldAlert className="w-5 h-5" />
          </div>
        </div>

        {/* Pending Commitments */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">Pending Obligations</p>
            <h3 className="text-2xl font-extrabold text-indigo-600 mt-1">{stats.pendingObligations}</h3>
            <p className="text-[11px] text-slate-400 mt-0.5">{stats.completedObligations} completed</p>
          </div>
          <div className="w-11 h-11 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
            <Calendar className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* Visual Analytics with Recharts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Risk Distribution Donut Chart */}
        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div className="flex items-center space-x-2">
              <PieIcon className="w-4 h-4 text-brand-600" />
              <h3 className="font-bold text-xs uppercase tracking-wider text-slate-800">
                Risk & Anomaly Severity Breakdown
              </h3>
            </div>
            <span className="text-xs font-mono font-bold text-slate-500">{totalRisks} Total Flags</span>
          </div>

          {riskPieData.length > 0 ? (
            <div className="h-64 flex flex-col sm:flex-row items-center justify-around">
              <div className="w-48 h-48">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={riskPieData}
                      cx="50%"
                      cy="50%"
                      innerRadius={50}
                      outerRadius={75}
                      paddingAngle={4}
                      dataKey="value"
                    >
                      {riskPieData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>

              <div className="space-y-2 text-xs">
                {riskPieData.map((item, idx) => (
                  <div key={idx} className="flex items-center space-x-2">
                    <span className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }} />
                    <span className="text-slate-600 font-medium">{item.name}:</span>
                    <span className="font-bold text-slate-900">{item.value}</span>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="h-64 flex flex-col items-center justify-center text-xs text-slate-400">
              No risk findings yet. Upload and analyze contracts to see distributions.
            </div>
          )}
        </div>

        {/* Clause Categories Bar Chart */}
        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div className="flex items-center space-x-2">
              <BarChart3 className="w-4 h-4 text-brand-600" />
              <h3 className="font-bold text-xs uppercase tracking-wider text-slate-800">
                Clause Categories Breakdown
              </h3>
            </div>
            <span className="text-xs font-mono font-bold text-slate-500">Categorized Clauses</span>
          </div>

          {stats.categoryBreakdown?.length > 0 ? (
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={stats.categoryBreakdown.slice(0, 6)} margin={{ top: 10, right: 10, left: -20, bottom: 20 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis dataKey="name" tick={{ fontSize: 9 }} interval={0} angle={-25} textAnchor="end" />
                  <YAxis tick={{ fontSize: 10 }} allowDecimals={false} />
                  <Tooltip />
                  <Bar dataKey="count" fill="#4f6bf5" radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <div className="h-64 flex flex-col items-center justify-center text-xs text-slate-400">
              No categorized clauses yet. Run AI analysis on documents to generate insights.
            </div>
          )}
        </div>
      </div>

      {/* Upcoming Deadlines & Recent Documents */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Upcoming Deadlines */}
        <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden space-y-3">
          <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Clock className="w-4 h-4 text-indigo-600" />
              <h3 className="font-bold text-xs uppercase tracking-wider text-slate-900">
                Upcoming Obligations & Deadlines
              </h3>
            </div>
            <Link to="/obligations" className="text-xs text-brand-600 hover:text-brand-700 font-semibold">
              View All &rarr;
            </Link>
          </div>

          <div className="p-4 pt-1 space-y-2">
            {stats.upcomingDeadlines?.length > 0 ? (
              stats.upcomingDeadlines.map((ob) => (
                <div key={ob._id} className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-between">
                  <div className="min-w-0 pr-2">
                    <p className="font-bold text-xs text-slate-900 truncate">{ob.title}</p>
                    <p className="text-[11px] text-slate-500 font-mono">
                      Due: {ob.dueDateRaw || (ob.dueDate ? new Date(ob.dueDate).toLocaleDateString() : 'Milestone')} • {ob.responsibleParty}
                    </p>
                  </div>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase shrink-0 ${
                    ob.priority === 'High' ? 'bg-red-100 text-red-700' : 'bg-slate-200 text-slate-700'
                  }`}>
                    {ob.priority}
                  </span>
                </div>
              ))
            ) : (
              <div className="py-8 text-center text-xs text-slate-400">
                No pending deadlines or commitments found.
              </div>
            )}
          </div>
        </div>

        {/* Recent Contracts */}
        <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden space-y-3">
          <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <FileText className="w-4 h-4 text-brand-600" />
              <h3 className="font-bold text-xs uppercase tracking-wider text-slate-900">
                Recent Contract Documents
              </h3>
            </div>
            <Link to="/documents" className="text-xs text-brand-600 hover:text-brand-700 font-semibold">
              View All &rarr;
            </Link>
          </div>

          <div className="p-4 pt-1 space-y-2">
            {stats.recentDocuments?.length > 0 ? (
              stats.recentDocuments.map((doc) => (
                <Link
                  key={doc._id}
                  to={`/documents/${doc._id}`}
                  className="p-3 bg-slate-50 hover:bg-slate-100/80 rounded-xl border border-slate-200 flex items-center justify-between transition-colors group"
                >
                  <div className="min-w-0 pr-2">
                    <p className="font-bold text-xs text-slate-900 truncate group-hover:text-brand-600">
                      {doc.originalName}
                    </p>
                    <p className="text-[11px] text-slate-400 font-mono">
                      {doc.pageCount} pages • {(doc.fileSize / (1024*1024)).toFixed(2)} MB • {doc.extractionMethod}
                    </p>
                  </div>
                  <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-brand-600 group-hover:translate-x-0.5 transition-transform" />
                </Link>
              ))
            ) : (
              <div className="py-8 text-center text-xs text-slate-400">
                No documents uploaded yet.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
