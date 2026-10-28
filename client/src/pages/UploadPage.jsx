import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  UploadCloud,
  FileText,
  AlertCircle,
  CheckCircle2,
  Loader2,
  FileCode,
  ShieldCheck,
  X,
  FileCheck,
  Sparkles,
} from 'lucide-react';
import api from '../services/api';

export const UploadPage = () => {
  const navigate = useNavigate();
  const fileInputRef = useRef(null);

  const [dragActive, setDragActive] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [loadingSample, setLoadingSample] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [processingStage, setProcessingStage] = useState('');
  const [error, setError] = useState(null);

  const handleLoadSample = async () => {
    setLoadingSample(true);
    setError(null);
    try {
      const res = await api.post('/documents/load-sample');
      if (res.data?.success) {
        navigate(`/documents/${res.data.data._id}`);
      }
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Failed to load sample contract');
    } finally {
      setLoadingSample(false);
    }
  };

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const validateAndSetFile = (file) => {
    setError(null);
    if (!file) return;

    if (file.type !== 'application/pdf' && !file.name.toLowerCase().endsWith('.pdf')) {
      setError('Unsupported file type. Please upload a PDF document (.pdf).');
      return;
    }

    const maxSizeMB = 15;
    if (file.size > maxSizeMB * 1024 * 1024) {
      setError(`File size (${(file.size / (1024 * 1024)).toFixed(1)}MB) exceeds the 15MB limit.`);
      return;
    }

    setSelectedFile(file);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      validateAndSetFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      validateAndSetFile(e.target.files[0]);
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) return;

    setUploading(true);
    setError(null);
    setUploadProgress(15);
    setProcessingStage('Uploading document to secure storage...');

    const formData = new FormData();
    formData.append('file', selectedFile);

    try {
      setUploadProgress(45);
      setProcessingStage('Parsing digital PDF text & structure...');

      const res = await api.post('/documents/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        onUploadProgress: (progressEvent) => {
          const percent = Math.round((progressEvent.loaded * 50) / progressEvent.total);
          setUploadProgress(percent);
        },
      });

      setUploadProgress(85);
      setProcessingStage('Normalizing extracted legal clauses...');

      if (res.data?.success) {
        setUploadProgress(100);
        setProcessingStage('Extraction complete! Redirecting...');
        const docId = res.data.data._id;
        setTimeout(() => {
          navigate(`/documents/${docId}`);
        }, 1000);
      } else {
        throw new Error(res.data?.message || 'Upload failed');
      }
    } catch (err) {
      setError(
        err.response?.data?.message ||
        err.message ||
        'Failed to process PDF. Check if the file is encrypted or corrupted.'
      );
      setUploading(false);
      setUploadProgress(0);
      setProcessingStage('');
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6 pb-12">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">Upload Legal Document</h1>
          <p className="text-xs text-slate-500 mt-1">
            Upload any contract, NDA, commercial lease, or legal agreement in PDF format.
          </p>
        </div>

        <button
          onClick={handleLoadSample}
          disabled={loadingSample || uploading}
          className="px-4 py-2.5 bg-gradient-to-r from-brand-600 to-indigo-600 hover:from-brand-700 hover:to-indigo-700 text-white rounded-xl text-xs font-semibold shadow-md flex items-center space-x-2 self-start sm:self-auto transition-all hover:scale-105"
        >
          {loadingSample ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>Generating Sample Contract...</span>
            </>
          ) : (
            <>
              <Sparkles className="w-4 h-4 text-brand-200" />
              <span>Load Sample Commercial Lease (1-Click Demo)</span>
            </>
          )}
        </button>
      </div>

      {error && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-2xl text-red-700 text-xs flex items-start space-x-3">
          <AlertCircle className="w-5 h-5 shrink-0 mt-0.5 text-red-600" />
          <div className="flex-1">
            <p className="font-semibold text-red-900">Upload / Extraction Error</p>
            <p className="mt-0.5">{error}</p>
          </div>
          <button onClick={() => setError(null)} className="text-red-400 hover:text-red-700">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Main Drag & Drop Box */}
      <div
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
        onClick={() => !uploading && fileInputRef.current?.click()}
        className={`border-2 border-dashed rounded-3xl p-8 sm:p-12 text-center transition-all cursor-pointer ${
          dragActive
            ? 'border-brand-500 bg-brand-50/50 scale-[1.01]'
            : 'border-slate-300 hover:border-brand-400 bg-white hover:bg-slate-50/50'
        } ${uploading ? 'pointer-events-none opacity-80' : ''}`}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept="application/pdf"
          onChange={handleFileChange}
          className="hidden"
          disabled={uploading}
        />

        <div className="max-w-md mx-auto space-y-4">
          <div className="w-16 h-16 rounded-2xl bg-brand-50 text-brand-600 flex items-center justify-center mx-auto shadow-sm">
            <UploadCloud className="w-8 h-8" />
          </div>

          <div>
            <h3 className="font-bold text-slate-900 text-base">
              {dragActive ? 'Drop your PDF here' : 'Click to select or drag & drop your contract'}
            </h3>
            <p className="text-xs text-slate-500 mt-1">
              Supports searchable and scanned PDF files up to 15MB.
            </p>
          </div>

          <div className="inline-flex items-center space-x-2 text-[11px] font-mono text-slate-400 px-3 py-1 bg-slate-100 rounded-full">
            <FileCode className="w-3.5 h-3.5 text-slate-500" />
            <span>Digital PDF Parsing + Tesseract OCR Fallback</span>
          </div>
        </div>
      </div>

      {/* Selected File Card */}
      {selectedFile && (
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3 min-w-0">
              <div className="w-10 h-10 rounded-xl bg-brand-50 text-brand-600 flex items-center justify-center shrink-0">
                <FileText className="w-5 h-5" />
              </div>
              <div className="min-w-0">
                <p className="font-bold text-xs text-slate-900 truncate">{selectedFile.name}</p>
                <p className="text-[11px] text-slate-400">
                  {(selectedFile.size / (1024 * 1024)).toFixed(2)} MB • PDF Document
                </p>
              </div>
            </div>

            {!uploading && (
              <button
                type="button"
                onClick={() => setSelectedFile(null)}
                className="p-1.5 text-slate-400 hover:text-red-600 transition-colors"
                title="Remove file"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Upload / Extraction Progress */}
          {uploading ? (
            <div className="space-y-2 pt-2">
              <div className="flex items-center justify-between text-xs">
                <span className="font-medium text-slate-700 flex items-center gap-1.5">
                  <Loader2 className="w-3.5 h-3.5 animate-spin text-brand-600" />
                  {processingStage}
                </span>
                <span className="font-mono font-bold text-brand-600">{uploadProgress}%</span>
              </div>
              <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                <div
                  className="bg-brand-600 h-2 rounded-full transition-all duration-300 ease-out"
                  style={{ width: `${uploadProgress}%` }}
                />
              </div>
            </div>
          ) : (
            <div className="flex justify-end pt-2">
              <button
                type="button"
                onClick={handleUpload}
                className="px-6 py-2.5 bg-brand-600 hover:bg-brand-700 text-white font-semibold rounded-xl text-xs shadow-sm flex items-center space-x-2 transition-all"
              >
                <FileCheck className="w-4 h-4" />
                <span>Process & Extract Text</span>
              </button>
            </div>
          )}
        </div>
      )}

      {/* Security & Extraction Guarantees Notice */}
      <div className="p-4 rounded-2xl bg-slate-100/70 border border-slate-200 grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs text-slate-600">
        <div className="flex items-start space-x-2.5">
          <ShieldCheck className="w-4 h-4 text-brand-600 shrink-0 mt-0.5" />
          <div>
            <p className="font-semibold text-slate-800">Isolated & Private</p>
            <p className="text-[11px] text-slate-500 mt-0.5">
              Documents are private to your user account and never shared across accounts or public models.
            </p>
          </div>
        </div>

        <div className="flex items-start space-x-2.5">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
          <div>
            <p className="font-semibold text-slate-800">Dual-Engine OCR</p>
            <p className="text-[11px] text-slate-500 mt-0.5">
              Scanned photocopies automatically pass to Tesseract OCR when digital text layers are missing.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
