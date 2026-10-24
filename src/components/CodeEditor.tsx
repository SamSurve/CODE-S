'use client';

import React, { useState, useEffect, useRef } from 'react';
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

// Dynamically import Monaco Editor with ssr: false
const MonacoEditor = dynamic(() => import('@monaco-editor/react'), {
  ssr: false,
  loading: () => null // We handle fallback gracefully below so it never looks blank
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
  activePracticalExpNumber?: string;
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
  activePracticalTitle,
  activePracticalExpNumber
}: CodeEditorProps) {
  const [copied, setCopied] = useState(false);
  const [theme, setTheme] = useState<'vs-dark' | 'light'>('vs-dark');
  const [fontSize, setFontSize] = useState<number>(14);
  const [isMonacoReady, setIsMonacoReady] = useState(false);

  // Reference to the active Monaco Editor instance
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const editorRef = useRef<any>(null);

  // Sync Monaco value whenever `code` prop updates from parent (e.g. practical dropdown selection)
  useEffect(() => {
    if (editorRef.current) {
      const currentVal = editorRef.current.getValue();
      if (currentVal !== code) {
        editorRef.current.setValue(code || '');
      }
    }
  }, [code]);

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

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleEditorDidMount = (editor: any) => {
    editorRef.current = editor;
    setIsMonacoReady(true);
    // Force immediate sync of code into Monaco
    if (code && editor.getValue() !== code) {
      editor.setValue(code);
    }
    // Re-layout to prevent zero-height bugs
    setTimeout(() => {
      editor.layout();
    }, 50);
  };

  const fileName = language === 'cpp' ? 'main.cpp' : 'main.c';
  const lines = (code || '').split('\n');

  return (
    <div className="flex flex-col h-full bg-[#121214] border border-zinc-800 rounded-xl overflow-hidden shadow-2xl">
      {/* Editor Header Bar */}
      <div className="flex flex-wrap items-center justify-between gap-2 px-3 py-2 bg-[#18181b] border-b border-zinc-800 shrink-0">
        {/* Left: Tab Name & Language Selector */}
        <div className="flex items-center gap-2">
          {/* File Tab */}
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-[#121214] border border-zinc-700/80 text-xs font-mono text-zinc-100 font-semibold shadow-inner">
            <FileCode className="w-3.5 h-3.5 text-blue-400" />
            <span>{fileName}</span>
          </div>

          {/* Language Selector */}
          <div className="flex items-center gap-1 px-2.5 py-1 rounded-md bg-zinc-950 border border-zinc-800 text-xs">
            <Code2 className="w-3.5 h-3.5 text-zinc-400" />
            <select
              value={language}
              onChange={(e) => onLanguageChange(e.target.value as SupportedLanguage)}
              className="bg-transparent text-zinc-300 font-medium focus:outline-none cursor-pointer text-xs"
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
            <span className="hidden xl:inline-block text-[11px] text-zinc-400 font-sans truncate max-w-[200px]">
              {activePracticalExpNumber ? `${activePracticalExpNumber}: ` : ''}{activePracticalTitle}
            </span>
          )}
        </div>

        {/* Right: Actions and Primary RUN Button */}
        <div className="flex items-center gap-1.5">
          {/* Upload Button */}
          <button
            onClick={onUploadClick}
            className="flex items-center gap-1 px-2.5 py-1 text-xs font-medium rounded-md bg-zinc-900 hover:bg-zinc-800 text-zinc-300 border border-zinc-800 transition-colors"
            title="Upload .c or .cpp file"
          >
            <Upload className="w-3.5 h-3.5 text-zinc-400" />
            <span className="hidden sm:inline">Upload</span>
          </button>

          {/* Copy Code */}
          <button
            onClick={handleCopy}
            className="flex items-center gap-1 px-2.5 py-1 text-xs font-medium rounded-md bg-zinc-900 hover:bg-zinc-800 text-zinc-300 border border-zinc-800 transition-colors"
            title="Copy code"
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
            className="p-1.5 rounded-md bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-zinc-400 hover:text-white transition-colors"
            title="Download source code"
          >
            <Download className="w-3.5 h-3.5" />
          </button>

          {/* Reset Code */}
          <button
            onClick={onReset}
            className="p-1.5 rounded-md bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-zinc-400 hover:text-white transition-colors"
            title="Reset code to PDF version"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>

          {/* Theme Switcher */}
          <button
            onClick={() => setTheme(theme === 'vs-dark' ? 'light' : 'vs-dark')}
            className="p-1.5 rounded-md bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-zinc-400 hover:text-white transition-colors"
            title={`Switch to ${theme === 'vs-dark' ? 'Light' : 'Dark'} theme`}
          >
            {theme === 'vs-dark' ? <Sun className="w-3.5 h-3.5" /> : <Moon className="w-3.5 h-3.5" />}
          </button>

          {/* Prominent Blue RUN Button */}
          <button
            onClick={onRun}
            disabled={isLoading}
            className={`flex items-center gap-1.5 px-4 py-1.5 text-xs font-bold rounded-md shadow-md transition-all active:scale-95 ${
              isLoading
                ? 'bg-blue-600/70 text-blue-200 cursor-wait'
                : 'bg-blue-600 hover:bg-blue-500 text-white shadow-blue-600/30'
            }`}
          >
            {isLoading ? (
              <>
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
                <span>Running...</span>
              </>
            ) : (
              <>
                <span>Run</span>
                <Play className="w-3.5 h-3.5 fill-current" />
              </>
            )}
          </button>
        </div>
      </div>

      {/* Editor Canvas Container */}
      <div className="relative flex-1 min-h-[350px] bg-[#121214] overflow-hidden">
        {/* Instant Native Code Display: guarantees code is ALWAYS immediately visible even before/while Monaco loads */}
        {!isMonacoReady && (
          <div className="absolute inset-0 flex bg-[#121214] font-mono text-xs overflow-auto z-10">
            {/* Line Numbers */}
            <div className="py-2.5 px-2 bg-[#18181b] text-zinc-600 select-none text-right border-r border-zinc-800 font-mono text-[13px] leading-relaxed min-w-[40px]">
              {lines.map((_, i) => (
                <div key={i}>{i + 1}</div>
              ))}
            </div>
            {/* Native Code Textarea */}
            <textarea
              value={code}
              onChange={(e) => onChange(e.target.value)}
              spellCheck={false}
              className="flex-1 p-2.5 bg-transparent text-zinc-200 font-mono text-[13px] leading-relaxed focus:outline-none resize-none selection:bg-blue-600/30 whitespace-pre"
              style={{ tabSize: 4 }}
            />
          </div>
        )}

        {/* Monaco Editor Canvas */}
        <div className={`w-full h-full ${!isMonacoReady ? 'opacity-0' : 'opacity-100 transition-opacity duration-150'}`}>
          <MonacoEditor
            key={`${activePracticalExpNumber || 'editor'}-${language}`}
            height="100%"
            language={language === 'cpp' ? 'cpp' : 'c'}
            value={code}
            theme={theme}
            onMount={handleEditorDidMount}
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
              padding: { top: 10, bottom: 10 }
            }}
          />
        </div>
      </div>

      {/* Footer Info Bar */}
      <div className="flex items-center justify-between px-3 py-1.5 bg-[#18181b] border-t border-zinc-800 text-[11px] text-zinc-500 font-mono shrink-0">
        <div className="flex items-center gap-3">
          <span>{language.toUpperCase()} GCC</span>
          <span>Lines: {lines.length}</span>
          <span className="hidden sm:inline">UTF-8</span>
        </div>
        <div className="flex items-center gap-2">
          <span>Zoom:</span>
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
  );
}
