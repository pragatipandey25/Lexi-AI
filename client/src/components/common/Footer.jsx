import React from 'react';
import { Shield, ExternalLink, AlertTriangle, Scale } from 'lucide-react';

export const Footer = () => {
  return (
    <footer className="bg-slate-900 text-slate-400 text-sm border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Important Legal Disclaimer Banner */}
        <div className="mb-10 p-4 rounded-2xl bg-slate-800/80 border border-slate-700 flex items-start space-x-3 text-slate-300">
          <AlertTriangle className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
          <div className="text-xs leading-relaxed">
            <span className="font-semibold text-white uppercase tracking-wider block mb-0.5">
              Legal Information & AI Technology Disclaimer
            </span>
            LexiAI is an automated AI-assisted document comprehension tool built for educational, research, and informational assistance. 
            <strong> LexiAI does not provide legal advice and does not create an attorney-client relationship.</strong> The outputs, risk scores, and clause analyses are algorithmic suggestions that must be reviewed and verified by a qualified legal professional before making any commercial, legal, or binding decisions.
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-10">
          <div className="space-y-3 md:col-span-2">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 rounded-lg bg-brand-600 flex items-center justify-center text-white">
                <Scale className="w-4 h-4" />
              </div>
              <span className="text-lg font-bold text-white tracking-tight">LexiAI</span>
            </div>
            <p className="text-xs text-slate-400 max-w-md leading-relaxed">
              Empowering individuals, students, and businesses to decode dense contracts, detect hidden risks, catch contradictory clauses, and track legal deadlines using state-of-the-art Generative AI.
            </p>
            <div className="text-[11px] text-slate-500 font-mono">
              Final Year Major Project • B.Tech CSE • MERN Stack & Gemini AI
            </div>
          </div>

          <div>
            <h4 className="text-xs font-semibold text-white uppercase tracking-wider mb-3">Core Modules</h4>
            <ul className="space-y-2 text-xs">
              <li>Smart PDF & OCR Ingestion</li>
              <li>AI Legal Summary & Clauses</li>
              <li>Risk & Suspicious Scanner</li>
              <li>Document Grounded Chat</li>
              <li>Bilingual (English & Hindi)</li>
            </ul>
          </div>

          <div>
            <h4 className="text-xs font-semibold text-white uppercase tracking-wider mb-3">Capabilities</h4>
            <ul className="space-y-2 text-xs">
              <li>Clause Categorization</li>
              <li>Obligation & Deadline Tracker</li>
              <li>Dual Document Comparison</li>
              <li>Downloadable PDF Reports</li>
              <li>Zero Data Leaks / Private</li>
            </ul>
          </div>
        </div>

        <div className="pt-6 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500">
          <p>&copy; {new Date().getFullYear()} LexiAI Project. Built with MERN, Tailwind CSS & Google Gemini.</p>
          <p className="mt-2 sm:mt-0">Academic Final Year Project Demonstration</p>
        </div>
      </div>
    </footer>
  );
};
