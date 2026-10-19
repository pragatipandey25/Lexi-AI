import React, { useState } from 'react';
import {
  Tags,
  Search,
  FileText,
  CreditCard,
  XCircle,
  Lock,
  Shield,
  Scale,
  RefreshCw,
  CheckCircle,
  Cpu,
  Eye,
  BookOpen,
} from 'lucide-react';

export const ClauseCategorizationView = ({ analysis }) => {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [search, setSearch] = useState('');

  if (!analysis || !analysis.categorizedClauses || analysis.categorizedClauses.length === 0) {
    return (
      <div className="bg-white rounded-3xl border border-slate-200 p-12 text-center space-y-4 shadow-sm">
        <div className="w-16 h-16 rounded-2xl bg-slate-100 text-slate-400 flex items-center justify-center mx-auto">
          <Tags className="w-8 h-8" />
        </div>
        <div>
          <h3 className="font-bold text-slate-900 text-base">No Categorized Clauses Found</h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto mt-1">
            Run the AI Legal Analysis to automatically parse and classify clauses into legal categories.
          </p>
        </div>
      </div>
    );
  }

  const clauses = analysis.categorizedClauses;

  const categories = [
    'all',
    'Payment and Fees',
    'Termination',
    'Confidentiality',
    'Liability and Indemnity',
    'Dispute Resolution',
    'Renewal',
    'Obligations',
    'Intellectual Property',
    'Privacy and Data Protection',
    'Governing Law',
    'Miscellaneous',
  ];

  const filtered = clauses.filter((c) => {
    if (selectedCategory !== 'all' && c.category !== selectedCategory) return false;
    if (search) {
      const q = search.toLowerCase();
      const matchTitle = c.title?.toLowerCase().includes(q);
      const matchText = c.clauseText?.toLowerCase().includes(q);
      const matchExp = c.explanation?.toLowerCase().includes(q);
      if (!matchTitle && !matchText && !matchExp) return false;
    }
    return true;
  });

  return (
    <div className="space-y-6">
      {/* Search and Category Filter Toolbar */}
      <div className="bg-white p-4 rounded-3xl border border-slate-200 shadow-sm space-y-4">
        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
          <input
            type="text"
            placeholder="Search within categorized clauses by keyword or term..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-brand-500 outline-none"
          />
        </div>

        {/* Categories Pills */}
        <div className="flex items-center gap-1.5 flex-wrap">
          {categories.map((cat) => {
            const count = cat === 'all' ? clauses.length : clauses.filter((c) => c.category === cat).length;
            if (count === 0 && cat !== 'all') return null;

            return (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1.5 rounded-xl text-xs font-medium transition-all flex items-center space-x-1.5 ${
                  selectedCategory === cat
                    ? 'bg-brand-600 text-white font-semibold shadow-sm'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                <span>{cat === 'all' ? 'All Clauses' : cat}</span>
                <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-mono ${
                  selectedCategory === cat ? 'bg-brand-700 text-white' : 'bg-slate-200 text-slate-700'
                }`}>
                  {count}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Clause Cards Grid */}
      <div className="space-y-4">
        {filtered.length > 0 ? (
          filtered.map((item, idx) => (
            <div
              key={idx}
              className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm space-y-3 hover:border-slate-300 transition-all"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div className="flex items-center space-x-2">
                  <span className="text-[10px] font-mono font-semibold px-2.5 py-1 rounded-md bg-brand-50 text-brand-700 border border-brand-200">
                    {item.category}
                  </span>
                  <h4 className="font-bold text-xs text-slate-900">{item.title}</h4>
                </div>

                <span className="text-[11px] font-mono text-slate-400 bg-slate-50 px-2 py-0.5 rounded border border-slate-200 self-start sm:self-auto">
                  {item.sectionOrPage || 'Clause Reference'}
                </span>
              </div>

              {/* Plain language explanation */}
              <div className="p-3 bg-slate-50/80 rounded-xl border border-slate-100 text-xs text-slate-800 space-y-1">
                <span className="font-semibold text-brand-700 text-[11px] block">Plain Language Meaning:</span>
                <p className="leading-relaxed">{item.explanation}</p>
              </div>

              {/* Exact Clause Excerpt */}
              {item.clauseText && (
                <div className="text-[11px] font-mono text-slate-600 bg-slate-100/50 p-3 rounded-xl border border-slate-200 italic leading-relaxed">
                  &quot;{item.clauseText}&quot;
                </div>
              )}
            </div>
          ))
        ) : (
          <div className="py-12 bg-white rounded-2xl border border-slate-200 text-center text-xs text-slate-500">
            No clauses found matching your category and keyword filter.
          </div>
        )}
      </div>
    </div>
  );
};
