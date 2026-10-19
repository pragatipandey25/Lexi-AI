import React, { useState } from 'react';
import { Languages, BookOpen, AlertCircle, Copy, Check, Sparkles, Scale } from 'lucide-react';

export const BilingualExplainView = ({ analysis }) => {
  const [language, setLanguage] = useState('hi'); // 'en' | 'hi'
  const [copied, setCopied] = useState(false);
  const [glossarySearch, setGlossarySearch] = useState('');

  if (!analysis) {
    return (
      <div className="bg-white rounded-3xl border border-slate-200 p-12 text-center space-y-4 shadow-sm">
        <Languages className="w-8 h-8 text-slate-400 mx-auto" />
        <h3 className="font-bold text-slate-900 text-sm">Bilingual Deconstruction Ready</h3>
        <p className="text-xs text-slate-500 max-w-sm mx-auto">
          Please run AI Legal Analysis to generate simple English and Hindi translations.
        </p>
      </div>
    );
  }

  const { explanationEn, explanationHi, legalTermsGlossary } = analysis;
  const currentExplanation = language === 'hi' ? explanationHi : explanationEn;

  const handleCopy = () => {
    if (currentExplanation) {
      navigator.clipboard.writeText(currentExplanation);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const filteredGlossary = (legalTermsGlossary || []).filter((g) => {
    if (!glossarySearch) return true;
    const q = glossarySearch.toLowerCase();
    return (
      g.term?.toLowerCase().includes(q) ||
      g.plainMeaning?.toLowerCase().includes(q) ||
      g.hindiMeaning?.toLowerCase().includes(q)
    );
  });

  return (
    <div className="space-y-6">
      {/* Language Switcher Bar */}
      <div className="bg-white rounded-3xl border border-slate-200 p-4 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="flex items-center space-x-2">
          <div className="w-9 h-9 rounded-xl bg-brand-50 text-brand-600 flex items-center justify-center">
            <Languages className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-bold text-xs text-slate-900">Document Plain Explanation</h3>
            <p className="text-[11px] text-slate-500">Deconstruct legal wording into accessible everyday language</p>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <button
            onClick={() => setLanguage('en')}
            className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
              language === 'en'
                ? 'bg-brand-600 text-white shadow-sm'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            English Explanation
          </button>
          <button
            onClick={() => setLanguage('hi')}
            className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
              language === 'hi'
                ? 'bg-brand-600 text-white shadow-sm'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            हिंदी व्याख्या (Hindi)
          </button>
        </div>
      </div>

      {/* Main Explanation Content Card */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-sm space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div className="flex items-center space-x-2">
            <Sparkles className="w-4 h-4 text-brand-600" />
            <h4 className="font-bold text-xs text-slate-800 uppercase tracking-wider">
              {language === 'hi' ? 'दस्तावेज़ का सरल हिंदी सारांश' : 'Complete Contract Deconstruction in Plain English'}
            </h4>
          </div>

          <button
            onClick={handleCopy}
            className="px-3 py-1 bg-slate-50 border border-slate-200 hover:bg-slate-100 text-slate-600 rounded-lg text-xs font-medium flex items-center space-x-1 transition-colors"
          >
            {copied ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-600" />
                <span className="text-emerald-600">Copied</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5 text-slate-400" />
                <span>Copy Text</span>
              </>
            )}
          </button>
        </div>

        <div className="p-4 bg-slate-50/60 rounded-2xl border border-slate-100 text-slate-800 text-xs sm:text-sm leading-relaxed whitespace-pre-wrap">
          {currentExplanation || (
            <span className="text-slate-400 italic">
              Explanation for {language === 'hi' ? 'Hindi' : 'English'} is not available. Please run analysis.
            </span>
          )}
        </div>

        {/* Informational Translation Disclaimer */}
        <div className="p-3 bg-amber-50/70 border border-amber-200 rounded-xl flex items-start space-x-2.5 text-xs text-amber-900">
          <Scale className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
          <p className="text-[11px] leading-relaxed">
            <strong>Bilingual Disclaimer:</strong> Translations and simplified interpretations are generated by AI for informational understanding. They do not constitute official certified legal translations. The original English contract text remains legally binding in court proceedings.
          </p>
        </div>
      </div>

      {/* Legal Terms Glossary Card */}
      {legalTermsGlossary?.length > 0 && (
        <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-sm space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-3">
            <div className="flex items-center space-x-2">
              <BookOpen className="w-4 h-4 text-brand-600" />
              <h4 className="font-bold text-xs text-slate-800 uppercase tracking-wider">
                Key Legal Terms Glossary & Definitions
              </h4>
            </div>

            <input
              type="text"
              placeholder="Search legal terms..."
              value={glossarySearch}
              onChange={(e) => setGlossarySearch(e.target.value)}
              className="px-3 py-1 bg-slate-50 border border-slate-200 rounded-lg text-xs outline-none focus:ring-1 focus:ring-brand-500 w-44"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredGlossary.map((term, idx) => (
              <div key={idx} className="p-4 bg-slate-50/70 rounded-2xl border border-slate-200 space-y-2">
                <div className="flex items-center justify-between">
                  <h5 className="font-bold text-xs text-brand-900">{term.term}</h5>
                  {term.hindiMeaning && (
                    <span className="text-[11px] font-semibold text-slate-600 bg-slate-200/60 px-2 py-0.5 rounded">
                      {term.hindiMeaning}
                    </span>
                  )}
                </div>

                <p className="text-xs text-slate-700 leading-relaxed">
                  <span className="font-semibold text-slate-800">Meaning: </span>
                  {term.plainMeaning}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
