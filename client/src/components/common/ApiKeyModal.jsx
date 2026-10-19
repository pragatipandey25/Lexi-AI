import React, { useState } from 'react';
import { Key, ExternalLink, Check, AlertCircle, X, ShieldCheck } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export const ApiKeyModal = ({ isOpen, onClose }) => {
  const { user, updateApiKey, systemStatus } = useAuth();
  const [apiKey, setApiKey] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);
  const [error, setError] = useState(null);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setMessage(null);

    try {
      await updateApiKey(apiKey);
      setMessage(apiKey ? 'Gemini API key saved successfully!' : 'Custom API key removed.');
      setTimeout(() => {
        onClose();
      }, 1500);
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Failed to update key');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-lg overflow-hidden">
        {/* Header */}
        <div className="px-6 py-4 bg-slate-900 text-white flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="p-2 bg-brand-500/20 text-brand-400 rounded-lg">
              <Key className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-semibold text-lg text-white">Google Gemini API Configuration</h3>
              <p className="text-xs text-slate-400">LexiAI uses Gemini models for document intelligence</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white transition-colors p-1 rounded-md"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 space-y-4">
          {systemStatus?.serverKeyConfigured ? (
            <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl flex items-start space-x-3 text-emerald-800 text-sm">
              <ShieldCheck className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
              <div>
                <p className="font-medium">Server API Key Active</p>
                <p className="text-xs text-emerald-700 mt-0.5">
                  The server already has a default Gemini API key configured. You may still supply your own personal key below to override it.
                </p>
              </div>
            </div>
          ) : (
            <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl flex items-start space-x-3 text-amber-800 text-sm">
              <AlertCircle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
              <div>
                <p className="font-medium">No Server API Key Found</p>
                <p className="text-xs text-amber-700 mt-0.5">
                  Provide your Google Gemini API key below to enable legal analysis, risk scanning, summaries, and document Q&A.
                </p>
              </div>
            </div>
          )}

          <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 text-xs text-slate-600 space-y-2">
            <div className="font-medium text-slate-800 flex items-center justify-between">
              <span>How to get a free Gemini API key:</span>
              <a
                href="https://aistudio.google.com/app/apikey"
                target="_blank"
                rel="noreferrer"
                className="text-brand-600 hover:text-brand-700 font-semibold inline-flex items-center space-x-1"
              >
                <span>Google AI Studio</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>
            <ol className="list-decimal pl-4 space-y-1 text-slate-500">
              <li>Log in to Google AI Studio with your Google account.</li>
              <li>Click <strong>&quot;Create API Key&quot;</strong> and select a project.</li>
              <li>Copy and paste your key into the field below.</li>
            </ol>
          </div>

          {user?.hasCustomApiKey && (
            <div className="text-xs text-emerald-700 bg-emerald-50 p-2.5 rounded-lg border border-emerald-200 flex items-center justify-between">
              <span>You currently have a personal API key configured.</span>
              <button
                type="button"
                onClick={() => {
                  setApiKey('');
                  handleSubmit({ preventDefault: () => {} });
                }}
                className="text-red-600 hover:text-red-800 font-medium hover:underline text-xs"
              >
                Clear key
              </button>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1">
                Gemini API Key
              </label>
              <input
                type="password"
                placeholder={user?.hasCustomApiKey ? 'Enter new key to replace existing...' : 'AIzaSy...'}
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-brand-500 focus:border-brand-500 outline-none transition-all placeholder:text-slate-400 font-mono"
              />
            </div>

            {error && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-red-700 text-xs flex items-center space-x-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            {message && (
              <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-700 text-xs flex items-center space-x-2">
                <Check className="w-4 h-4 shrink-0" />
                <span>{message}</span>
              </div>
            )}

            <div className="flex items-center justify-end space-x-3 pt-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-sm text-slate-600 hover:text-slate-900 rounded-xl font-medium transition-colors"
              >
                Close
              </button>
              <button
                type="submit"
                disabled={loading || !apiKey}
                className="px-5 py-2 text-sm bg-brand-600 hover:bg-brand-700 disabled:opacity-50 text-white rounded-xl font-medium shadow-sm transition-all"
              >
                {loading ? 'Saving...' : 'Save API Key'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
