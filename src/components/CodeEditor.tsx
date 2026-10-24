'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  Play,
  RotateCcw,
  Copy,
  Check,
  Download,
  Upload,
  Code2,
  FileCode,
  Loader2,
  Scan
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

const PADDING_TOP = 8;
const PADDING_BOTTOM = 16;

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
  const [lineHeight, setLineHeight] = useState<number>(20);
  const [isAutoFit, setIsAutoFit] = useState<boolean>(true);

  const editorCanvasRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const gutterRef = useRef<HTMLDivElement>(null);
  const isAutoFitRef = useRef<boolean>(true);

  // Keep isAutoFitRef in sync with state
  useEffect(() => {
    isAutoFitRef.current = isAutoFit;
  }, [isAutoFit]);

  // Dynamically calculate font size and line height so all lines fit into available canvas height
  const calculateAndApplyFit = useCallback(() => {
    if (!editorCanvasRef.current) return;
    const canvasHeight = editorCanvasRef.current.clientHeight;
    if (canvasHeight <= 0) return;

    const lineCount = (code || '').split('\n').length || 1;
    const totalPadding = PADDING_TOP + PADDING_BOTTOM;
    const usableHeight = Math.max(60, canvasHeight - totalPadding);

    // Calculate line height needed to fit all lines vertically
    const targetLineHeight = Math.floor(usableHeight / lineCount);

    // Clamp line height between 15px (crisp legible minimum) and 24px (comfortable maximum)
    const fitLineHeight = Math.min(24, Math.max(15, targetLineHeight));

    // Calculate proportional font size between 10px and 14px
    const fitFontSize = Math.min(14, Math.max(10, Math.round(fitLineHeight * 0.65)));

    setLineHeight(fitLineHeight);
    setFontSize(fitFontSize);
  }, [code]);

  // Auto-fit whenever active practical changes
  useEffect(() => {
    setIsAutoFit(true);
    isAutoFitRef.current = true;
    calculateAndApplyFit();

    if (textareaRef.current) {
      textareaRef.current.scrollTop = 0;
      textareaRef.current.scrollLeft = 0;
    }
    if (gutterRef.current) {
      gutterRef.current.scrollTop = 0;
    }
  }, [activePracticalTitle, calculateAndApplyFit]);

  // Watch for container resizes with ResizeObserver and window resize
  useEffect(() => {
    calculateAndApplyFit();

    const canvas = editorCanvasRef.current;
    if (!canvas || typeof ResizeObserver === 'undefined') return;

    const observer = new ResizeObserver(() => {
      if (isAutoFitRef.current) {
        calculateAndApplyFit();
      }
    });

    observer.observe(canvas);

    const handleWindowResize = () => {
      if (isAutoFitRef.current) {
        calculateAndApplyFit();
      }
    };
    window.addEventListener('resize', handleWindowResize);

    return () => {
      observer.disconnect();
      window.removeEventListener('resize', handleWindowResize);
    };
  }, [calculateAndApplyFit]);

  // One-click "Fit Code" button handler
  const handleFitCode = () => {
    setIsAutoFit(true);
    isAutoFitRef.current = true;
    calculateAndApplyFit();
    if (textareaRef.current) {
      textareaRef.current.scrollTop = 0;
      textareaRef.current.scrollLeft = 0;
    }
    if (gutterRef.current) {
      gutterRef.current.scrollTop = 0;
    }
  };

  // Manual zoom controls
  const handleZoomIn = () => {
    setIsAutoFit(false);
    isAutoFitRef.current = false;
    const nextSize = Math.min(18, fontSize + 1);
    setFontSize(nextSize);
    setLineHeight(Math.round(nextSize * 1.55));
  };

  const handleZoomOut = () => {
    setIsAutoFit(false);
    isAutoFitRef.current = false;
    const nextSize = Math.max(10, fontSize - 1);
    setFontSize(nextSize);
    setLineHeight(Math.round(nextSize * 1.55));
  };

  // Sync scroll between textarea and line-number gutter
  const handleScroll = (e: React.UIEvent<HTMLTextAreaElement>) => {
    if (gutterRef.current) {
      gutterRef.current.scrollTop = e.currentTarget.scrollTop;
    }
  };

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
      <div className="flex flex-wrap items-center justify-between gap-1.5 px-3 py-1.5 bg-[#18181b] border-b border-zinc-800 shrink-0">
        {/* Left: File Tab & Language Selector */}
        <div className="flex items-center gap-2">
          {/* File Tab */}
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-[#121214] border border-zinc-700/80 text-xs font-mono text-zinc-100 font-semibold shadow-inner">
            <FileCode className="w-3.5 h-3.5 text-blue-400" />
            <span>{fileName}</span>
          </div>

          {/* Language Selector */}
          <div className="flex items-center gap-1 px-2 py-0.5 rounded-md bg-zinc-950 border border-zinc-800 text-xs">
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
            <span className="hidden xl:inline-block text-[11px] text-zinc-400 font-sans truncate max-w-[220px]">
              {activePracticalExpNumber ? `${activePracticalExpNumber}: ` : ''}{activePracticalTitle}
            </span>
          )}
        </div>

        {/* Right: Actions and Primary RUN Button */}
        <div className="flex items-center gap-1.5">
          {/* One-Click "Fit Code" Button */}
          <button
            onClick={handleFitCode}
            className={`flex items-center gap-1 px-2.5 py-1 text-xs font-medium rounded-md border transition-all ${
              isAutoFit
                ? 'bg-blue-600/20 text-blue-300 border-blue-500/50 font-semibold shadow-sm'
                : 'bg-zinc-900 hover:bg-zinc-800 text-zinc-300 border-zinc-800'
            }`}
            title="Auto-fit complete code into visible editor (No scrolling)"
          >
            <Scan className="w-3.5 h-3.5 text-blue-400" />
            <span className="hidden sm:inline">Fit Code</span>
          </button>

          {/* Upload Button */}
          <button
            onClick={onUploadClick}
            className="flex items-center gap-1 px-2 py-1 text-xs font-medium rounded-md bg-zinc-900 hover:bg-zinc-800 text-zinc-300 border border-zinc-800 transition-colors"
            title="Upload .c or .cpp file"
          >
            <Upload className="w-3.5 h-3.5 text-zinc-400" />
            <span className="hidden sm:inline">Upload</span>
          </button>

          {/* Copy Code */}
          <button
            onClick={handleCopy}
            className="flex items-center gap-1 px-2 py-1 text-xs font-medium rounded-md bg-zinc-900 hover:bg-zinc-800 text-zinc-300 border border-zinc-800 transition-colors"
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
            className="p-1 rounded-md bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-zinc-400 hover:text-white transition-colors"
            title="Download source code"
          >
            <Download className="w-3.5 h-3.5" />
          </button>

          {/* Reset Code */}
          <button
            onClick={onReset}
            className="p-1 rounded-md bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-zinc-400 hover:text-white transition-colors"
            title="Reset code to original PDF version"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>

          {/* Prominent Blue RUN Button */}
          <button
            onClick={onRun}
            disabled={isLoading}
            className={`flex items-center gap-1.5 px-3.5 py-1 text-xs font-bold rounded-md shadow-md transition-all active:scale-95 ${
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

      {/* Editor Canvas: Full Available Height with Pixel-Perfect Alignment */}
      <div
        ref={editorCanvasRef}
        className="relative flex-1 min-h-0 bg-[#121214] flex overflow-hidden cursor-text"
        onClick={() => textareaRef.current?.focus()}
      >
        {/* Line Numbers Gutter */}
        <div
          ref={gutterRef}
          aria-hidden="true"
          className="w-12 bg-[#18181b] text-zinc-500 select-none text-right pr-2.5 border-r border-zinc-800 font-mono overflow-hidden shrink-0"
          style={{
            fontSize: `${fontSize}px`,
            lineHeight: `${lineHeight}px`,
            paddingTop: `${PADDING_TOP}px`,
            paddingBottom: `${PADDING_BOTTOM}px`
          }}
        >
          {lines.map((_, i) => (
            <div
              key={i}
              style={{
                height: `${lineHeight}px`,
                lineHeight: `${lineHeight}px`
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
              lineHeight: `${lineHeight}px`,
              paddingTop: `${PADDING_TOP}px`,
              paddingBottom: `${PADDING_BOTTOM}px`,
              paddingLeft: '12px',
              paddingRight: '12px',
              tabSize: 4
            }}
          />
        </div>
      </div>

      {/* Footer Info Bar */}
      <div className="flex items-center justify-between px-3 py-1 bg-[#18181b] border-t border-zinc-800 text-[11px] text-zinc-500 font-mono shrink-0">
        <div className="flex items-center gap-2.5">
          <span>{language.toUpperCase()} GCC</span>
          <span>Lines: {lines.length}</span>
          <span className="hidden sm:inline">
            Font: {fontSize}px / {lineHeight}px
          </span>
          <span className="hidden md:inline px-1.5 py-0.2 rounded bg-zinc-900 border border-zinc-800 text-zinc-400">
            {isAutoFit ? 'Auto-Fit: ON' : 'Custom Zoom'}
          </span>
          <span className="hidden lg:inline text-zinc-600">Ctrl+Enter to Run</span>
        </div>
        <div className="flex items-center gap-1.5">
          <button
            onClick={handleZoomOut}
            className="px-1.5 py-0.5 rounded bg-zinc-900 hover:bg-zinc-800 text-zinc-400 hover:text-white border border-zinc-800"
            title="Zoom Out"
          >
            -
          </button>
          <span className="text-zinc-300 w-8 text-center">{fontSize}px</span>
          <button
            onClick={handleZoomIn}
            className="px-1.5 py-0.5 rounded bg-zinc-900 hover:bg-zinc-800 text-zinc-400 hover:text-white border border-zinc-800"
            title="Zoom In"
          >
            +
          </button>
        </div>
      </div>
    </div>
  );
}