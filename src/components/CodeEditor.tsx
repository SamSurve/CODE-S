'use client';

import React, { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import {
  Play,
  RotateCcw,
  Copy,
  Check,
  Download,
  Upload,
  Code2,
  Moon,
  Sun,
  Loader2,
  FileCode
} from 'lucide-react';
import { SupportedLanguage } from '../types';

// Dynamically import Monaco Editor to avoid SSR issues
const MonacoEditor = dynamic(() => import('@monaco-editor/react'), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full min-h-[400px] flex flex-col items-center justify-center bg-zinc-950 text-zinc-500 font-mono text-xs gap-3">
      <Loader2 className="w-6 h-6 animate-spin text-blue-500" />
      <span>Initializing Code Editor environment...</span>
    </div>
  )
});

interface CodeEditorProps {
  code: string;
  onChange: (value: string) => void;
  language: SupportedLanguage;
  onLanguageChange: (lang: SupportedLanguage) => void;
  onRun: () => void;
  onReset: () => void;
  isLoading: boolean;
  onUploadClick: () => void;
  activePracticalTitle?: string;
}

export default function CodeEditor({
  code,
  onChange,
  language,
  onLanguageChange,
  onReset,
  onRun,
  isLoading,
  onUploadClick,
  activePracticalTitle
}: CodeEditorProps) {
  const [copied, setCopied] = useState(false);
  const [theme, setTheme] = useState<'vs-dark' | 'light'>('vs-dark');
  const [fontSize, setFontSize] = useState<number>(14);

  // Keyboard shortcut: Ctrl+Enter or Cmd+Enter to Run
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
        e.preventDefault();
        if (!isLoading) {
          onRun();
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isLoading, onRun]);

  const handleCopy = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    const ext = language === 'cpp' ? 'cpp' : 'c';
    const blob = new Blob([code], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `solution.${ext}`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="flex flex-col h-full bg-zinc-950 rounded-2xl border border-zinc-800 overflow-hidden shadow-xl">
      {/* Editor Header Bar */}
      <div className="flex flex-wrap items-center justify-between gap-2 px-4 py-2.5 bg-zinc-900 border-b border-zinc-800">
        {/* Left: Language selector & Practical info */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-zinc-950 border border-zinc-800 text-xs">
            <Code2 className="w-4 h-4 text-blue-400" />
            <select
              value={language}
              onChange={(e) => onLanguageChange(e.target.value as SupportedLanguage)}
              className="bg-transparent text-zinc-200 font-semibold focus:outline-none cursor-pointer text-xs"
            >
              <option value="c" className="bg-zinc-900 text-zinc-200">
                C (GCC 9.2.0)
              </option>
              <option value="cpp" className="bg-zinc-900 text-zinc-200">
                C++ (G++ 9.2.0)
              </option>
            </select>
          </div>

          {activePracticalTitle && (
            <div className="hidden lg:flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-blue-500/10 border border-blue-500/20 text-xs text-blue-300 font-mono">
              <FileCode className="w-3.5 h-3.5" />
              <span className="truncate max-w-[200px]">{activePracticalTitle}</span>
            </div>
          )}
        </div>

        {/* Right: Actions (Run, Reset, Copy, Download, Upload, Theme) */}
        <div className="flex items-center gap-2">
          {/* Upload Button */}
          <button
            onClick={onUploadClick}
            className="flex items-center gap-1 px-2.5 py-1.5 text-xs font-medium rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-300 transition-colors"
            title="Upload .c or .cpp file"
          >
            <Upload className="w-3.5 h-3.5 text-zinc-400" />
            <span className="hidden sm:inline">Upload</span>
          </button>

          {/* Copy Code */}
          <button
            onClick={handleCopy}
            className="flex items-center gap-1 px-2.5 py-1.5 text-xs font-medium rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-300 transition-colors"
            title="Copy code to clipboard"
          >
            {copied ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-400" />
                <span className="text-emerald-400 hidden sm:inline">Copied</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5 text-zinc-400" />
                <span className="hidden sm:inline">Copy</span>
              </>
            )}
          </button>

          {/* Download Code */}
          <button
            onClick={handleDownload}
            className="flex items-center gap-1 px-2.5 py-1.5 text-xs font-medium rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-300 transition-colors"
            title="Download source code"
          >
            <Download className="w-3.5 h-3.5 text-zinc-400" />
            <span className="hidden sm:inline">Download</span>
          </button>

          {/* Reset Code */}
          <button
            onClick={onReset}
            className="flex items-center gap-1 px-2.5 py-1.5 text-xs font-medium rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-300 transition-colors"
            title="Reset to default code"
          >
            <RotateCcw className="w-3.5 h-3.5 text-zinc-400" />
            <span className="hidden sm:inline">Reset</span>
          </button>

          {/* Theme Toggle */}
          <button
            onClick={() => setTheme(theme === 'vs-dark' ? 'light' : 'vs-dark')}
            className="p-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-300 transition-colors"
            title={`Switch to ${theme === 'vs-dark' ? 'Light' : 'Dark'} theme`}
          >
            {theme === 'vs-dark' ? <Sun className="w-3.5 h-3.5" /> : <Moon className="w-3.5 h-3.5" />}
          </button>

          {/* Run Button (Primary) */}
          <button
            onClick={onRun}
            disabled={isLoading}
            className={`flex items-center gap-2 px-4 py-1.5 text-xs font-bold rounded-lg shadow-lg transition-all active:scale-95 ${
              isLoading
                ? 'bg-blue-600/70 text-blue-200 cursor-wait'
                : 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-emerald-600/30'
            }`}
          >
            {isLoading ? (
              <>
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
                <span>Running...</span>
              </>
            ) : (
              <>
                <Play className="w-3.5 h-3.5 fill-current" />
                <span>Run Code</span>
                <span className="hidden md:inline-block px-1 py-0.2 rounded bg-black/20 text-[10px] font-mono opacity-80">
                  Ctrl+↵
                </span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Editor Body */}
      <div className="relative flex-1 min-h-[380px] sm:min-h-[460px] bg-zinc-950">
        <MonacoEditor
          height="100%"
          language={language === 'cpp' ? 'cpp' : 'c'}
          value={code}
          theme={theme}
          onChange={(val) => onChange(val || '')}
          options={{
            fontSize: fontSize,
            minimap: { enabled: false },
            scrollBeyondLastLine: false,
            automaticLayout: true,
            tabSize: 4,
            lineNumbers: 'on',
            lineDecorationsWidth: 10,
            wordWrap: 'on',
            fontFamily: "var(--font-geist-mono), 'Fira Code', Consolas, monospace",
            renderWhitespace: 'selection',
            smoothScrolling: true,
            padding: { top: 12, bottom: 12 }
          }}
        />
      </div>

      {/* Editor Footer Status Bar */}
      <div className="flex items-center justify-between px-4 py-1.5 bg-zinc-900 border-t border-zinc-800 text-[11px] text-zinc-500 font-mono">
        <div className="flex items-center gap-4">
          <span>{language.toUpperCase()} GCC</span>
          <span>UTF-8</span>
          <span>Tab: 4 spaces</span>
        </div>
        <div className="flex items-center gap-3">
          <span className="hidden sm:inline">Lines: {code.split('\n').length}</span>
          <div className="flex items-center gap-1">
            <span className="text-zinc-600">Font:</span>
            <button
              onClick={() => setFontSize(Math.max(12, fontSize - 1))}
              className="px-1 text-zinc-400 hover:text-white"
            >
              -
            </button>
            <span className="text-zinc-300">{fontSize}px</span>
            <button
              onClick={() => setFontSize(Math.min(20, fontSize + 1))}
              className="px-1 text-zinc-400 hover:text-white"
            >
              +
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
