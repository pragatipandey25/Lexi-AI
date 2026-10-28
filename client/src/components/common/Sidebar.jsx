import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  FileText,
  UploadCloud,
  ShieldAlert,
  CalendarClock,
  GitCompare,
  Settings,
  Sparkles,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export const Sidebar = () => {
  const { hasValidAiKey } = useAuth();

  const navItems = [
    { label: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
    { label: 'Documents', path: '/documents', icon: FileText },
    { label: 'Upload PDF', path: '/upload', icon: UploadCloud },
    { label: 'Obligations', path: '/obligations', icon: CalendarClock },
    { label: 'Compare Docs', path: '/compare', icon: GitCompare },
    { label: 'Settings & Key', path: '/settings', icon: Settings },
  ];

  return (
    <aside className="w-64 bg-white border-r border-slate-200 hidden lg:flex flex-col flex-shrink-0 min-h-[calc(100vh-4rem)]">
      <div className="p-4 flex-1 space-y-1">
        <div className="px-3 py-2 text-[11px] font-bold uppercase tracking-wider text-slate-400">
          Core Workspaces
        </div>
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                `flex items-center space-x-3 px-3.5 py-2.5 rounded-xl text-sm font-medium transition-colors ${
                  isActive
                    ? 'bg-brand-50 text-brand-700 font-semibold'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                }`
              }
            >
              <Icon className="w-4 h-4" />
              <span>{item.label}</span>
            </NavLink>
          );
        })}
      </div>

      {/* AI Intelligence status card in sidebar */}
      <div className="p-4 border-t border-slate-200">
        <div className={`p-3 rounded-xl border text-xs ${
          hasValidAiKey ? 'bg-brand-50/70 border-brand-200 text-brand-900' : 'bg-amber-50 border-amber-200 text-amber-900'
        }`}>
          <div className="flex items-center space-x-2 font-semibold mb-1">
            <Sparkles className={`w-3.5 h-3.5 ${hasValidAiKey ? 'text-brand-600' : 'text-amber-600'}`} />
            <span>{hasValidAiKey ? 'Gemini Legal AI Active' : 'AI Engine Inactive'}</span>
          </div>
          <p className="text-[11px] text-slate-500 leading-tight">
            {hasValidAiKey
              ? 'Ready for structured extraction, risk analysis & plain English conversion.'
              : 'Add your Gemini API key in Settings to activate AI modules.'}
          </p>
        </div>
      </div>
    </aside>
  );
};
