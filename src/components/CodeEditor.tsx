'use client';

import React, { useState, useEffect, useRef } from 'react';
import {
  Play,
  RotateCcw,
  Copy,
  Check,
  Download,
  Upload,
  Code2,
  FileCode,
  Loader2
} from 'lucide-react';
import { SupportedLanguage } from '../types';

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

const LINE_HEIGHT_PX = 24;

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
  const [fontSize, setFontSize] = useState<number>(13);

  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const gutterRef = useRef<HTMLDivElement>(null);

  // Sync scroll between textarea and line-number gutter
  const handleScroll = (e: React.UIEvent<HTMLTextAreaElement>) => {
    if (gutterRef.current) {
      gutterRef.current.scrollTop = e.currentTarget.scrollTop;
    }
  };

  // When practical changes or resets, scroll editor back to top line 1
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.scrollTop = 0;
      textareaRef.current.scrollLeft = 0;
    }
    if (gutterRef.current) {
      gutterRef.current.scrollTop = 0;
    }
  }, [activePracticalTitle]);

  // Keyboard support: Tab key inserts 4 spaces, Ctrl+Enter runs code
  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
      e.preventDefault();
      if (!isLoading) {
        onRun();
      }
      return;
    }

    if (e.key === 'Tab') {
      e.preventDefault();
      const textarea = textareaRef.current;
      if (!textarea) return;

      const start = textarea.selectionStart;
      const end = textarea.selectionEnd;
      const spaces = '    ';

      const updatedCode = code.substring(0, start) + spaces + code.substring(end);
      onChange(updatedCode);

      // Restore cursor position after state update
      setTimeout(() => {
        textarea.selectionStart = textarea.selectionEnd = start + spaces.length;
      }, 0);
    }
  };

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

  const fileName = language === 'cpp' ? 'main.cpp' : 'main.c';
  const lines = (code || '').split('\n');

  return (
    <div className="flex flex-col h-full bg-[#121214] border border-zinc-800 rounded-xl overflow-hidden shadow-2xl select-text">
      {/* Editor Header Bar */}
      <div className="flex flex-wrap items-center justify-between gap-2 px-3 py-2 bg-[#18181b] border-b border-zinc-800 shrink-0">
        {/* Left: File Tab & Language Selector */}
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
            title="Reset code to original PDF version"
          >
            <RotateCcw className="w-3.5 h-3.5" />
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

      {/* Editor Canvas: Reliable, Controlled Multiline Editor with Line-Number Gutter */}
      <div
        className="relative flex-1 min-h-0 bg-[#121214] flex overflow-hidden cursor-text"
        onClick={() => textareaRef.current?.focus()}
      >
        {/* Line Numbers Gutter */}
        <div
          ref={gutterRef}
          aria-hidden="true"
          className="w-12 bg-[#18181b] text-zinc-600 select-none text-right pr-3 border-r border-zinc-800 font-mono overflow-hidden shrink-0"
          style={{
            fontSize: `${fontSize}px`,
            lineHeight: `${LINE_HEIGHT_PX}px`,
            paddingTop: '12px',
            paddingBottom: '48px'
          }}
        >
          {lines.map((_, i) => (
            <div
              key={i}
              style={{
                height: `${LINE_HEIGHT_PX}px`,
                lineHeight: `${LINE_HEIGHT_PX}px`
              }}
            >
              {i + 1}
            </div>
          ))}
        </div>

        {/* Controlled Code Textarea */}
        <div className="flex-1 relative h-full min-h-0 overflow-hidden">
          <textarea
            ref={textareaRef}
            value={code}
            onChange={(e) => onChange(e.target.value)}
            onScroll={handleScroll}
            onKeyDown={handleKeyDown}
            spellCheck={false}
            autoCapitalize="off"
            autoComplete="off"
            autoCorrect="off"
            placeholder="// Type or paste C/C++ code here..."
            className="w-full h-full bg-transparent text-emerald-100 font-mono focus:outline-none resize-none overflow-auto whitespace-pre selection:bg-blue-600/40 tab-4 caret-white"
            style={{
              fontSize: `${fontSize}px`,
              lineHeight: `${LINE_HEIGHT_PX}px`,
              paddingTop: '12px',
              paddingBottom: '48px',
              paddingLeft: '12px',
              paddingRight: '12px',
              tabSize: 4
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
          <span className="hidden md:inline">Ctrl+Enter to Run</span>
        </div>
        <div className="flex items-center gap-2">
          <span>Zoom:</span>
          <button
            onClick={() => setFontSize(Math.max(11, fontSize - 1))}
            className="px-1 text-zinc-400 hover:text-white"
          >
            -
          </button>
          <span className="text-zinc-300">{fontSize}px</span>
          <button
            onClick={() => setFontSize(Math.min(18, fontSize + 1))}
            className="px-1 text-zinc-400 hover:text-white"
          >
            +
          </button>
        </div>
      </div>
    </div>
  );
}
