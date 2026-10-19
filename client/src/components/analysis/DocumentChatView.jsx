import React, { useState, useEffect, useRef } from 'react';
import {
  MessageSquare,
  Send,
  Loader2,
  Trash2,
  Sparkles,
  Bot,
  User,
  Quote,
  AlertCircle,
  HelpCircle,
} from 'lucide-react';
import api from '../../services/api';

export const DocumentChatView = ({ document }) => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [fetchingHistory, setFetchingHistory] = useState(true);
  const [error, setError] = useState(null);
  const messagesEndRef = useRef(null);

  const quickPrompts = [
    'What is the notice period for termination?',
    'What happens if payment or rent is delayed?',
    'What are my key obligations and responsibilities?',
    'Can this agreement renew automatically?',
    'Explain the liability and indemnity provision in simple terms.',
  ];

  const fetchChatHistory = async () => {
    setFetchingHistory(true);
    try {
      const res = await api.get(`/chat/${document._id}`);
      if (res.data?.success) {
        setMessages(res.data.data.messages || []);
      }
    } catch (err) {
      console.warn('Could not load chat history:', err);
    } finally {
      setFetchingHistory(false);
    }
  };

  useEffect(() => {
    fetchChatHistory();
  }, [document._id]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  const handleSendMessage = async (textToSend) => {
    const query = textToSend || input;
    if (!query || !query.trim() || loading) return;

    setError(null);
    setInput('');
    setLoading(true);

    // Optimistically add user message
    const tempUserMsg = {
      _id: `temp-${Date.now()}`,
      role: 'user',
      content: query.trim(),
      createdAt: new Date().toISOString(),
    };
    setMessages((prev) => [...prev, tempUserMsg]);

    try {
      const res = await api.post(`/chat/${document._id}`, { message: query.trim() });
      if (res.data?.success) {
        const { assistantMessage } = res.data.data;
        setMessages((prev) => [...prev.filter((m) => m._id !== tempUserMsg._id), res.data.data.userMessage, assistantMessage]);
      }
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Failed to get answer from AI');
      // Rollback optimistic message if failed
      setMessages((prev) => prev.filter((m) => m._id !== tempUserMsg._id));
    } finally {
      setLoading(false);
    }
  };

  const handleClearHistory = async () => {
    if (!window.confirm('Clear all conversation history for this document?')) return;
    try {
      await api.delete(`/chat/${document._id}`);
      setMessages([]);
    } catch (err) {
      alert('Failed to clear chat history');
    }
  };

  return (
    <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden flex flex-col h-[700px]">
      {/* Chat Header */}
      <div className="px-6 py-4 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
        <div className="flex items-center space-x-2.5">
          <div className="w-9 h-9 rounded-xl bg-brand-600 text-white flex items-center justify-center shadow-sm">
            <Bot className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-bold text-xs text-slate-900">Document-Grounded AI Assistant</h3>
            <p className="text-[11px] text-slate-500">
              Answers are restricted strictly to evidence in &quot;{document.originalName}&quot;
            </p>
          </div>
        </div>

        {messages.length > 0 && (
          <button
            onClick={handleClearHistory}
            className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
            title="Clear conversation"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Messages Scroll Area */}
      <div className="flex-1 p-6 overflow-y-auto space-y-4">
        {fetchingHistory ? (
          <div className="py-20 text-center space-y-2">
            <Loader2 className="w-6 h-6 animate-spin text-brand-600 mx-auto" />
            <p className="text-xs text-slate-400">Loading conversation history...</p>
          </div>
        ) : messages.length === 0 ? (
          <div className="py-16 text-center space-y-4 max-w-md mx-auto">
            <div className="w-12 h-12 rounded-2xl bg-brand-50 text-brand-600 flex items-center justify-center mx-auto">
              <Sparkles className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-bold text-xs text-slate-900">Ask any question about this contract</h4>
              <p className="text-[11px] text-slate-500 mt-1">
                LexiAI will cite relevant clauses and clarify dense legal language without hallucinating.
              </p>
            </div>

            {/* Quick Prompts */}
            <div className="pt-2 flex flex-col gap-2">
              <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">Suggested Questions:</p>
              {quickPrompts.map((prompt, idx) => (
                <button
                  key={idx}
                  onClick={() => handleSendMessage(prompt)}
                  className="text-left p-2.5 text-xs text-slate-700 bg-slate-50 hover:bg-brand-50 hover:text-brand-700 rounded-xl border border-slate-200 transition-all font-medium"
                >
                  &quot;{prompt}&quot;
                </button>
              ))}
            </div>
          </div>
        ) : (
          messages.map((msg, idx) => {
            const isUser = msg.role === 'user';
            return (
              <div
                key={msg._id || idx}
                className={`flex items-start space-x-3 ${isUser ? 'flex-row-reverse space-x-reverse' : ''}`}
              >
                <div
                  className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 ${
                    isUser ? 'bg-slate-900 text-white' : 'bg-brand-100 text-brand-700'
                  }`}
                >
                  {isUser ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
                </div>

                <div
                  className={`max-w-[80%] rounded-2xl p-4 text-xs leading-relaxed space-y-2 ${
                    isUser
                      ? 'bg-slate-900 text-white'
                      : 'bg-slate-50 border border-slate-200 text-slate-800'
                  }`}
                >
                  <p className="whitespace-pre-wrap">{msg.content}</p>

                  {/* Evidence Citation Bubbles */}
                  {!isUser && msg.sources?.length > 0 && (
                    <div className="pt-2 border-t border-slate-200/80 space-y-1.5">
                      <span className="text-[10px] font-semibold text-brand-700 uppercase tracking-wider block">
                        Document Citations:
                      </span>
                      {msg.sources.map((src, sIdx) => (
                        <div key={sIdx} className="p-2 bg-white rounded-lg border border-slate-200 text-[11px] font-mono text-slate-600 space-y-0.5">
                          {src.clauseTitle && <p className="font-bold text-slate-800">{src.clauseTitle}</p>}
                          {src.citation && <p className="italic text-slate-500">&quot;{src.citation}&quot;</p>}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            );
          })
        )}

        {loading && (
          <div className="flex items-start space-x-3">
            <div className="w-8 h-8 rounded-xl bg-brand-100 text-brand-700 flex items-center justify-center shrink-0">
              <Bot className="w-4 h-4" />
            </div>
            <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 text-xs text-slate-500 flex items-center space-x-2">
              <Loader2 className="w-4 h-4 animate-spin text-brand-600" />
              <span>Grounded retrieval from document text...</span>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input Bar */}
      <div className="p-4 bg-slate-50 border-t border-slate-200 space-y-2">
        {error && (
          <div className="p-2.5 bg-red-50 border border-red-200 rounded-xl text-red-700 text-xs flex items-center space-x-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSendMessage();
          }}
          className="flex items-center space-x-2"
        >
          <input
            type="text"
            placeholder="Ask a question about this contract (e.g. What is the penalty for early exit?)..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            disabled={loading}
            className="flex-1 px-4 py-2.5 bg-white border border-slate-300 rounded-xl text-xs focus:ring-2 focus:ring-brand-500 outline-none placeholder:text-slate-400"
          />

          <button
            type="submit"
            disabled={loading || !input.trim()}
            className="px-4 py-2.5 bg-brand-600 hover:bg-brand-700 disabled:opacity-50 text-white rounded-xl text-xs font-semibold shadow-sm flex items-center space-x-1 transition-all"
          >
            <span>Ask</span>
            <Send className="w-3.5 h-3.5" />
          </button>
        </form>
      </div>
    </div>
  );
};
