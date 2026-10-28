import React, { useState } from 'react';
import { Key, User, Globe, Shield, Check, AlertCircle, ExternalLink, Save } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export const SettingsPage = () => {
  const { user, updateProfile, updateApiKey, systemStatus } = useAuth();

  const [name, setName] = useState(user?.name || '');
  const [defaultLanguage, setDefaultLanguage] = useState(user?.preferences?.defaultLanguage || 'en');
  const [apiKey, setApiKey] = useState('');

  const [savingProfile, setSavingProfile] = useState(false);
  const [savingKey, setSavingKey] = useState(false);
  const [profileMsg, setProfileMsg] = useState(null);
  const [keyMsg, setKeyMsg] = useState(null);
  const [errorMsg, setErrorMsg] = useState(null);

  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    setSavingProfile(true);
    setProfileMsg(null);
    setErrorMsg(null);

    try {
      await updateProfile({
        name,
        preferences: { defaultLanguage },
      });
      setProfileMsg('Profile and preferences updated successfully');
      setTimeout(() => setProfileMsg(null), 3000);
    } catch (err) {
      setErrorMsg(err.message || 'Failed to update profile');
    } finally {
      setSavingProfile(false);
    }
  };

  const handleKeySubmit = async (e) => {
    e.preventDefault();
    setSavingKey(true);
    setKeyMsg(null);
    setErrorMsg(null);

    try {
      await updateApiKey(apiKey);
      setKeyMsg(apiKey ? 'Gemini API key updated successfully!' : 'Personal API key cleared');
      setApiKey('');
      setTimeout(() => setKeyMsg(null), 3000);
    } catch (err) {
      setErrorMsg(err.message || 'Failed to update API key');
    } finally {
      setSavingKey(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-12">
      <div>
        <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">Account & AI Settings</h1>
        <p className="text-xs text-slate-500 mt-1">
          Manage your personal profile, preferred explanation language, and Gemini API credentials.
        </p>
      </div>

      {errorMsg && (
        <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-red-700 text-xs flex items-center space-x-2">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}

      {/* 1. Profile & Preferences Card */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="px-6 py-4 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <User className="w-4 h-4 text-brand-600" />
            <h2 className="font-bold text-sm text-slate-900">User Profile & Language</h2>
          </div>
          {user?.role === 'owner' ? (
            <span className="px-2.5 py-0.5 rounded-full bg-brand-100 text-brand-800 border border-brand-200 text-[11px] font-bold uppercase tracking-wider font-mono flex items-center gap-1">
              <Shield className="w-3 h-3 text-brand-600" />
              <span>Project Owner & Lead</span>
            </span>
          ) : (
            <span className="px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-700 text-[11px] font-semibold">
              Standard User
            </span>
          )}
        </div>

        <form onSubmit={handleProfileSubmit} className="p-6 space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1">
                Full Name
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-brand-500 outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1">
                Registered Email
              </label>
              <input
                type="email"
                disabled
                value={user?.email || ''}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-100 text-slate-500 text-sm cursor-not-allowed"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1">
              Default Explanation Language
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
              <label
                className={`p-3.5 rounded-xl border flex items-center space-x-3 cursor-pointer transition-all ${
                  defaultLanguage === 'en'
                    ? 'border-brand-500 bg-brand-50/50 text-brand-900'
                    : 'border-slate-200 hover:border-slate-300 text-slate-700'
                }`}
              >
                <input
                  type="radio"
                  name="language"
                  value="en"
                  checked={defaultLanguage === 'en'}
                  onChange={() => setDefaultLanguage('en')}
                  className="text-brand-600 focus:ring-brand-500"
                />
                <div>
                  <div className="font-semibold text-xs">Simple English</div>
                  <div className="text-[11px] text-slate-500">Deconstruct legalese into plain, accessible English.</div>
                </div>
              </label>

              <label
                className={`p-3.5 rounded-xl border flex items-center space-x-3 cursor-pointer transition-all ${
                  defaultLanguage === 'hi'
                    ? 'border-brand-500 bg-brand-50/50 text-brand-900'
                    : 'border-slate-200 hover:border-slate-300 text-slate-700'
                }`}
              >
                <input
                  type="radio"
                  name="language"
                  value="hi"
                  checked={defaultLanguage === 'hi'}
                  onChange={() => setDefaultLanguage('hi')}
                  className="text-brand-600 focus:ring-brand-500"
                />
                <div>
                  <div className="font-semibold text-xs">Hindi (हिंदी)</div>
                  <div className="text-[11px] text-slate-500">सरल हिंदी में कानूनी शर्तों और दायित्वों की व्याख्या।</div>
                </div>
              </label>
            </div>
          </div>

          {profileMsg && (
            <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-700 text-xs flex items-center space-x-2">
              <Check className="w-4 h-4 shrink-0" />
              <span>{profileMsg}</span>
            </div>
          )}

          <div className="flex justify-end pt-2">
            <button
              type="submit"
              disabled={savingProfile}
              className="px-5 py-2.5 bg-brand-600 hover:bg-brand-700 disabled:opacity-50 text-white font-medium rounded-xl text-xs flex items-center space-x-2 shadow-sm"
            >
              <Save className="w-3.5 h-3.5" />
              <span>{savingProfile ? 'Saving...' : 'Save Profile Changes'}</span>
            </button>
          </div>
        </form>
      </div>

      {/* 2. Google Gemini AI Engine Configuration Card */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="px-6 py-4 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Key className="w-4 h-4 text-brand-600" />
            <h2 className="font-bold text-sm text-slate-900">Google Gemini AI Engine Credentials</h2>
          </div>
          <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-200 text-slate-700 font-semibold">
            gemini-1.5-flash / gemini-2.0-flash
          </span>
        </div>

        <div className="p-6 space-y-4">
          <div className="p-3.5 rounded-xl border text-xs space-y-1 bg-slate-50 border-slate-200">
            <div className="flex items-center justify-between">
              <span className="font-semibold text-slate-700">System AI Status:</span>
              <span className={`px-2 py-0.5 rounded-full font-semibold text-[10px] ${
                systemStatus?.serverKeyConfigured
                  ? 'bg-emerald-100 text-emerald-800'
                  : 'bg-amber-100 text-amber-800'
              }`}>
                {systemStatus?.serverKeyConfigured ? 'Server Key Active' : 'No Server Key in .env'}
              </span>
            </div>
            <p className="text-[11px] text-slate-500">
              {systemStatus?.serverKeyConfigured
                ? 'The backend server has an environment key configured in server/.env. Individual users can still configure an individual personal key below if desired.'
                : 'No key is defined in server/.env. Please input your personal Gemini API key below to unlock all AI features.'}
            </p>
          </div>

          <form onSubmit={handleKeySubmit} className="space-y-4">
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700">
                  Custom Gemini API Key
                </label>
                <a
                  href="https://aistudio.google.com/app/apikey"
                  target="_blank"
                  rel="noreferrer"
                  className="text-xs text-brand-600 hover:text-brand-700 font-medium inline-flex items-center space-x-1"
                >
                  <span>Get Free Key on Google AI Studio</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>
              <input
                type="password"
                placeholder={user?.hasCustomApiKey ? 'Key is configured. Enter new value to override...' : 'Paste your API key here (AIzaSy...)'}
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 font-mono text-sm focus:ring-2 focus:ring-brand-500 outline-none"
              />
            </div>

            {keyMsg && (
              <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-700 text-xs flex items-center space-x-2">
                <Check className="w-4 h-4 shrink-0" />
                <span>{keyMsg}</span>
              </div>
            )}

            <div className="flex items-center justify-between pt-1">
              {user?.hasCustomApiKey ? (
                <button
                  type="button"
                  onClick={() => {
                    setApiKey('');
                    handleKeySubmit({ preventDefault: () => {} });
                  }}
                  className="text-xs text-red-600 hover:text-red-700 font-medium underline"
                >
                  Clear personal API key
                </button>
              ) : <div />}

              <button
                type="submit"
                disabled={savingKey || !apiKey}
                className="px-5 py-2.5 bg-brand-600 hover:bg-brand-700 disabled:opacity-50 text-white font-medium rounded-xl text-xs flex items-center space-x-2 shadow-sm"
              >
                <span>{savingKey ? 'Verifying & Saving...' : 'Save Gemini Key'}</span>
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
