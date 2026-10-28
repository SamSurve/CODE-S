'use client';

import React, { useState, useRef } from 'react';
import { Upload, FileCode, CheckCircle2, AlertCircle, X, ArrowRight } from 'lucide-react';
import { SupportedLanguage } from '../types';

interface UploadModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCodeLoaded?: (code: string, language: SupportedLanguage, filename: string) => void;
  onUpload?: (code: string, filename?: string) => void;
}

export default function UploadModal({ isOpen, onClose, onCodeLoaded, onUpload }: UploadModalProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [fileContent, setFileContent] = useState<string>('');
  const [fileName, setFileName] = useState<string>('');
  const [language, setLanguage] = useState<SupportedLanguage>('c');
  const [error, setError] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);

  if (!isOpen) return null;

  const processFile = (file: File) => {
    setError(null);
    const name = file.name.toLowerCase();
    let detectedLang: SupportedLanguage = 'c';

    if (name.endsWith('.cpp') || name.endsWith('.cc') || name.endsWith('.cxx')) {
      detectedLang = 'cpp';
    } else if (name.endsWith('.c') || name.endsWith('.h')) {
      detectedLang = 'c';
    } else if (name.endsWith('.java')) {
      detectedLang = 'java';
    } else if (name.endsWith('.html') || name.endsWith('.htm')) {
      detectedLang = 'html';
    } else if (name.endsWith('.js') || name.endsWith('.jsx')) {
      detectedLang = 'javascript';
    } else if (name.endsWith('.asm') || name.endsWith('.s')) {
      detectedLang = 'asm';
    } else {
      setError('Please upload a supported code file (.c, .cpp, .java, .html, .js, .asm).');
      return;
    }

    if (file.size > 1024 * 512) {
      setError('File is too large. Maximum supported size is 512 KB.');
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const content = e.target?.result as string;
      setFileContent(content);
      setFileName(file.name);
      setLanguage(detectedLang);
    };
    reader.onerror = () => {
      setError('Failed to read file. Please try again.');
    };
    reader.readAsText(file);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      processFile(e.dataTransfer.files[0]);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleApply = () => {
    if (!fileContent) return;

    if (onCodeLoaded) {
      onCodeLoaded(fileContent, language, fileName);
    }
    if (onUpload) {
      onUpload(fileContent, fileName);
    }
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl bg-zinc-900 border border-zinc-800 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-zinc-800 bg-zinc-950/50">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-blue-500/10 text-blue-400 border border-blue-500/20">
              <Upload className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-zinc-100">Upload Source Code</h2>
              <p className="text-xs text-zinc-400">Import your local code file directly</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 overflow-y-auto space-y-5">
          {/* Dropzone */}
          <div
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onClick={() => fileInputRef.current?.click()}
            className={`cursor-pointer border-2 border-dashed rounded-xl p-8 text-center transition-all ${
              isDragging
                ? 'border-blue-500 bg-blue-500/10'
                : 'border-zinc-700/80 hover:border-zinc-500 hover:bg-zinc-800/40 bg-zinc-950/30'
            }`}
          >
            <input
              ref={fileInputRef}
              type="file"
              accept=".c,.cpp,.cc,.cxx,.h,.java,.html,.js,.asm,.s"
              className="hidden"
              onChange={(e) => {
                if (e.target.files && e.target.files.length > 0) {
                  processFile(e.target.files[0]);
                }
              }}
            />
            <div className="flex flex-col items-center gap-3">
              <div className="p-3.5 rounded-full bg-zinc-800 text-zinc-300">
                <FileCode className="w-8 h-8 text-blue-400" />
              </div>
              <div>
                <p className="text-sm font-medium text-zinc-200">
                  Click to select or drag and drop a source file
                </p>
                <p className="text-xs text-zinc-500 mt-1">
                  Supported formats: C, C++, Java, HTML, JS, ASM (up to 512 KB)
                </p>
              </div>
            </div>
          </div>

          {/* Error Message */}
          {error && (
            <div className="flex items-center gap-2 p-3 text-xs text-red-400 bg-red-950/40 border border-red-800/60 rounded-xl">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* File Preview */}
          {fileContent && (
            <div className="space-y-3">
              <div className="flex items-center justify-between text-xs text-zinc-400">
                <span className="flex items-center gap-1.5 text-emerald-400 font-medium">
                  <CheckCircle2 className="w-4 h-4" />
                  Loaded: {fileName}
                </span>
                <span className="font-mono text-zinc-500">
                  {fileContent.split('\n').length} lines · {language.toUpperCase()}
                </span>
              </div>
              <div className="max-h-48 overflow-y-auto rounded-xl border border-zinc-800 bg-zinc-950 p-4 font-mono text-xs text-zinc-300">
                <pre>{fileContent.slice(0, 2000)}{fileContent.length > 2000 ? '\n... (truncated preview)' : ''}</pre>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-zinc-800 bg-zinc-950/50">
          <button
            onClick={onClose}
            className="px-4 py-2 text-xs font-medium text-zinc-400 hover:text-zinc-200 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleApply}
            disabled={!fileContent}
            className="flex items-center gap-2 px-5 py-2 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-500 disabled:opacity-40 disabled:hover:bg-blue-600 rounded-xl shadow-md transition-all active:scale-95"
          >
            <span>Load into Editor</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
