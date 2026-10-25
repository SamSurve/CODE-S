'use client';

import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import {
  Play,
  RotateCcw,
  Copy,
  Check,
  Download,
  Upload,
  FileCode,
  Loader2,
  Scan
} from 'lucide-react';
import { SupportedLanguage } from '../types';

export interface EditorFile {
  name: string;
  code: string;
}

interface CodeEditorProps {
  files?: EditorFile[];
  activeFileIndex?: number;
  onActiveFileIndexChange?: (idx: number) => void;
  code?: string;
  onChange?: (value: string) => void;
  language: SupportedLanguage;
  onLanguageChange: (lang: SupportedLanguage) => void;
  onRun: () => void;
  onReset: () => void;
  isLoading: boolean;
  onUploadClick: () => void;
  isRunDisabled?: boolean;
}

// Strict shared metrics across Gutter, Highlight layer, and Textarea
const FONT_FAMILY =
  'ui-monospace, SFMono-Regular, "SF Mono", Menlo, Consolas, "Liberation Mono", monospace';
const PADDING_TOP = 8;
const PADDING_BOTTOM = 16;
const PADDING_X = 12;

function escapeHtml(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

// Fast regex-based syntax highlighter matching VS Code Dark+ theme
function highlightSyntax(code: string): string {
  if (!code) return '';

  const regex =
    /(\/\*[\s\S]*?\*\/|\/\/[^\n]*|<!--[\s\S]*?-->)|("(?:\\.|[^"\\])*"|'(?:\\.|[^'\\])*'|`[\s\S]*?`)|(#\s*[a-zA-Z_]\w*(?:\s*<[^>]+>|\s*"(?:\\.|[^"\\])*")?)|(\b(?:int|char|void|float|double|long|short|unsigned|signed|const|static|typedef|struct|sizeof|Node|bool|auto|public|private|protected|class|interface|extends|implements|new|import|package|abstract|final|super|this|throws|throw|try|catch|finally|boolean|byte|null|true|false|let|var|const|function|return|if|else|for|while|do|break|continue|switch|case|default|enum|typeof|instanceof)\b)|(@[a-zA-Z_]\w*)|(\b\d+(?:\.\d+)?(?:[eE][+-]?\d+)?[fFulL]*\b)|(\b[a-zA-Z_]\w*\s*(?=\())|(\b[a-zA-Z_]\w*\b)|([{}()[\];,.<>+\-*\/%&|^!=?:~]+)/g;

  let lastIndex = 0;
  let match: RegExpExecArray | null;
  let result = '';

  while ((match = regex.exec(code)) !== null) {
    if (match.index > lastIndex) {
      result += escapeHtml(code.substring(lastIndex, match.index));
    }

    const [
      full,
      comment,
      str,
      preprocessor,
      keyword,
      annotation,
      num,
      func,
      ident,
      punct
    ] = match;

    if (comment) {
      result += `<span class="text-[#6A9955] italic">${escapeHtml(comment)}</span>`;
    } else if (str) {
      result += `<span class="text-[#CE9178]">${escapeHtml(str)}</span>`;
    } else if (preprocessor) {
      result += `<span class="text-[#C586C0] font-semibold">${escapeHtml(preprocessor)}</span>`;
    } else if (annotation) {
      result += `<span class="text-[#DCDCAA] font-medium">${escapeHtml(annotation)}</span>`;
    } else if (keyword) {
      result += `<span class="text-[#569CD6] font-semibold">${escapeHtml(keyword)}</span>`;
    } else if (num) {
      result += `<span class="text-[#B5CEA8]">${escapeHtml(num)}</span>`;
    } else if (func) {
      result += `<span class="text-[#DCDCAA]">${escapeHtml(func)}</span>`;
    } else if (ident) {
      if (ident === 'printf' || ident === 'scanf' || ident === 'main' || ident === 'System' || ident === 'Scanner') {
        result += `<span class="text-[#4EC9B0]">${escapeHtml(ident)}</span>`;
      } else {
        result += `<span class="text-[#9CDCFE]">${escapeHtml(ident)}</span>`;
      }
    } else if (punct) {
      result += `<span class="text-[#D4D4D4]">${escapeHtml(punct)}</span>`;
    } else {
      result += escapeHtml(full);
    }

    lastIndex = regex.lastIndex;
  }

  if (lastIndex < code.length) {
    result += escapeHtml(code.substring(lastIndex));
  }

  return result;
}

export default function CodeEditor({
  files,
  activeFileIndex = 0,
  onActiveFileIndexChange,
  code: propCode,
  onChange: propOnChange,
  language,
  onLanguageChange,
  onRun,
  onReset,
  isLoading,
  onUploadClick,
  isRunDisabled = false
}: CodeEditorProps) {
  // Determine active code
  const hasMultipleFiles = Boolean(files && files.length > 1);
  const currentFile = files ? files[activeFileIndex] : null;
  const activeCode = currentFile ? currentFile.code : (propCode ?? '');

  const handleCodeChange = (newVal: string) => {
    if (propOnChange) {
      propOnChange(newVal);
    }
  };

  const [copied, setCopied] = useState(false);
  const [fontSize, setFontSize] = useState<number>(13);
  const [lineHeight, setLineHeight] = useState<number>(18);
  const [isAutoFit, setIsAutoFit] = useState<boolean>(false);

  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const gutterRef = useRef<HTMLDivElement>(null);
  const highlightRef = useRef<HTMLPreElement>(null);
  const editorBodyRef = useRef<HTMLDivElement>(null);
  const editorCanvasRef = useRef<HTMLDivElement>(null);

  // Split lines for line numbers
  const lines = useMemo(() => activeCode.split('\n'), [activeCode]);

  // Syntax highlighted HTML
  const highlightedHtml = useMemo(() => {
    return highlightSyntax(activeCode) + '\n';
  }, [activeCode]);

  // Synchronize gutter with editor body scroll
  const handleBodyScroll = useCallback(() => {
    if (!editorBodyRef.current || !gutterRef.current) return;
    gutterRef.current.scrollTop = editorBodyRef.current.scrollTop;
  }, []);

  const handleTextareaScroll = useCallback(() => {
    if (!textareaRef.current || !editorBodyRef.current) return;
    if (editorBodyRef.current.scrollTop !== textareaRef.current.scrollTop) {
      editorBodyRef.current.scrollTop = textareaRef.current.scrollTop;
    }
    if (editorBodyRef.current.scrollLeft !== textareaRef.current.scrollLeft) {
      editorBodyRef.current.scrollLeft = textareaRef.current.scrollLeft;
    }
  }, []);

  const resetScroll = useCallback(() => {
    if (editorBodyRef.current) {
      editorBodyRef.current.scrollTop = 0;
      editorBodyRef.current.scrollLeft = 0;
    }
    if (textareaRef.current) {
      textareaRef.current.scrollTop = 0;
      textareaRef.current.scrollLeft = 0;
    }
    if (gutterRef.current) {
      gutterRef.current.scrollTop = 0;
    }
  }, []);

  // Fit code into visible canvas
  const handleFitCode = useCallback(() => {
    if (!editorCanvasRef.current) return;

    const canvasHeight = editorCanvasRef.current.clientHeight;
    const availableHeight = canvasHeight - PADDING_TOP - PADDING_BOTTOM - 8;
    const totalLines = lines.length;

    if (totalLines <= 0 || availableHeight <= 0) return;

    let targetLineHeight = Math.floor(availableHeight / totalLines);
    targetLineHeight = Math.max(12, Math.min(22, targetLineHeight));
    const targetFontSize = Math.max(9, Math.min(16, Math.round(targetLineHeight * 0.72)));

    setFontSize(targetFontSize);
    setLineHeight(targetLineHeight);
    setIsAutoFit(true);
    resetScroll();
  }, [lines.length, resetScroll]);

  // Keyboard shortcut Ctrl+Enter / Cmd+Enter
  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
      e.preventDefault();
      if (!isLoading && !isRunDisabled) {
        onRun();
      }
    } else if (e.key === 'Tab') {
      e.preventDefault();
      const textarea = textareaRef.current;
      if (!textarea) return;

      const start = textarea.selectionStart;
      const end = textarea.selectionEnd;
      const val = textarea.value;

      const updated = val.substring(0, start) + '    ' + val.substring(end);
      handleCodeChange(updated);

      requestAnimationFrame(() => {
        textarea.selectionStart = textarea.selectionEnd = start + 4;
      });
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(activeCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    let extension = 'c';
    if (language === 'cpp') extension = 'cpp';
    else if (language === 'java') extension = 'java';
    else if (language === 'html') extension = 'html';
    else if (language === 'javascript') extension = 'js';

    const defaultName = currentFile?.name || (language === 'java' ? 'Main.java' : `main.${extension}`);
    const blob = new Blob([activeCode], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = defaultName;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleZoomIn = () => {
    setIsAutoFit(false);
    setFontSize((prev) => Math.min(prev + 1, 24));
    setLineHeight((prev) => Math.min(prev + 2, 34));
  };

  const handleZoomOut = () => {
    setIsAutoFit(false);
    setFontSize((prev) => Math.max(prev - 1, 9));
    setLineHeight((prev) => Math.max(prev - 2, 12));
  };

  // Generic tab name when single file
  const genericFileName = useMemo(() => {
    if (currentFile?.name) return currentFile.name;
    switch (language) {
      case 'java':
        return 'Main.java';
      case 'cpp':
        return 'main.cpp';
      case 'html':
        return 'index.html';
      case 'javascript':
        return 'main.js';
      default:
        return 'main.c';
    }
  }, [currentFile, language]);

  return (
    <div className="flex flex-col h-full bg-[#121214] text-zinc-100 overflow-hidden">
      {/* Top Controls Toolbar */}
      <div className="flex items-center justify-between px-3 h-10 border-b border-zinc-800 bg-[#18181b] shrink-0">
        {/* Left: File name / File tabs + Language selector */}
        <div className="flex items-center gap-2">
          {hasMultipleFiles ? (
            /* Multi-file tabs */
            <div className="flex items-center gap-1 overflow-x-auto max-w-[280px] sm:max-w-[420px] scrollbar-none py-1">
              {files!.map((f, idx) => (
                <button
                  key={f.name}
                  onClick={() => onActiveFileIndexChange && onActiveFileIndexChange(idx)}
                  className={`flex items-center gap-1.5 px-2.5 py-1 text-xs rounded-md transition-colors border ${
                    activeFileIndex === idx
                      ? 'bg-zinc-800 text-white border-zinc-700 font-semibold shadow-sm'
                      : 'bg-zinc-950/40 text-zinc-400 hover:text-zinc-200 border-zinc-800/80 hover:bg-zinc-900'
                  }`}
                >
                  <FileCode className="w-3.5 h-3.5 text-blue-400" />
                  <span className="font-mono text-[11px]">{f.name}</span>
                </button>
              ))}
            </div>
          ) : (
            /* Single generic file tab */
            <div className="flex items-center gap-1.5 px-2.5 py-1 text-xs bg-zinc-900 border border-zinc-800 text-zinc-300 rounded-md">
              <FileCode className="w-3.5 h-3.5 text-blue-400" />
              <span className="font-mono text-xs">{genericFileName}</span>
            </div>
          )}

          {/* Language Selector */}
          <div className="flex items-center gap-1 bg-zinc-900 border border-zinc-800 rounded-md px-2 py-1 text-xs">
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
              <option value="java" className="bg-zinc-900 text-zinc-200">
                Java (OpenJDK 13)
              </option>
              <option value="html" className="bg-zinc-900 text-zinc-200">
                HTML / CSS / JS
              </option>
              <option value="javascript" className="bg-zinc-900 text-zinc-200">
                JavaScript
              </option>
            </select>
          </div>
        </div>

        {/* Right: Actions and Primary RUN Button */}
        <div className="flex items-center gap-1.5">
          {/* Fit Code */}
          <button
            onClick={handleFitCode}
            className={`flex items-center gap-1 px-2.5 py-1 text-xs font-medium rounded-md border transition-all ${
              isAutoFit
                ? 'bg-blue-600/20 text-blue-300 border-blue-500/50 font-semibold shadow-sm'
                : 'bg-zinc-900 hover:bg-zinc-800 text-zinc-300 border-zinc-800'
            }`}
            title="Auto-fit code into visible editor"
          >
            <Scan className="w-3.5 h-3.5 text-blue-400" />
            <span className="hidden sm:inline">Fit Code</span>
          </button>

          {/* Upload */}
          <button
            onClick={onUploadClick}
            className="flex items-center gap-1 px-2 py-1 text-xs font-medium rounded-md bg-zinc-900 hover:bg-zinc-800 text-zinc-300 border border-zinc-800 transition-colors"
            title="Upload source file"
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
                <Copy className="w-3.5 h-3.5" />
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
            onClick={() => {
              onReset();
              requestAnimationFrame(resetScroll);
            }}
            className="p-1 rounded-md bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-zinc-400 hover:text-white transition-colors"
            title="Reset code to original version"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>

          {/* Prominent RUN Button */}
          <button
            onClick={onRun}
            disabled={isLoading || isRunDisabled}
            className={`flex items-center gap-1.5 px-3.5 py-1 text-xs font-bold rounded-md shadow-md transition-all active:scale-95 ${
              isRunDisabled
                ? 'bg-zinc-800 text-zinc-500 cursor-not-allowed border border-zinc-700'
                : isLoading
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

      {/* Editor Canvas */}
      <div
        ref={editorCanvasRef}
        className="relative flex-1 min-h-0 bg-[#121214] flex overflow-hidden cursor-text"
        onClick={() => textareaRef.current?.focus()}
      >
        {/* Layer 1: Line Numbers Gutter */}
        <div
          ref={gutterRef}
          aria-hidden="true"
          className="w-12 bg-[#18181b] text-zinc-600 select-none text-right pr-2.5 border-r border-zinc-800 font-mono overflow-hidden shrink-0 pointer-events-none"
          style={{
            fontFamily: FONT_FAMILY,
            fontSize: `${fontSize}px`,
            lineHeight: `${lineHeight}px`,
            paddingTop: `${PADDING_TOP}px`,
            paddingBottom: `${PADDING_BOTTOM}px`,
            boxSizing: 'border-box'
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

        {/* Editor Body */}
        <div
          ref={editorBodyRef}
          onScroll={handleBodyScroll}
          className="flex-1 relative h-full min-h-0 overflow-auto"
        >
          {/* Layer 2: In-Flow Syntax Highlighted <pre> */}
          <pre
            ref={highlightRef}
            aria-hidden="true"
            className="relative min-h-full m-0 pointer-events-none select-none font-mono whitespace-pre"
            style={{
              fontFamily: FONT_FAMILY,
              fontSize: `${fontSize}px`,
              lineHeight: `${lineHeight}px`,
              paddingTop: `${PADDING_TOP}px`,
              paddingBottom: `${PADDING_BOTTOM}px`,
              paddingLeft: `${PADDING_X}px`,
              paddingRight: `${PADDING_X}px`,
              tabSize: 4,
              margin: 0,
              border: 'none',
              boxSizing: 'border-box',
              background: 'transparent'
            }}
            dangerouslySetInnerHTML={{ __html: highlightedHtml }}
          />

          {/* Layer 3: Controlled Interactive <textarea> Layer */}
          <textarea
            ref={textareaRef}
            value={activeCode}
            onChange={(e) => handleCodeChange(e.target.value)}
            onScroll={handleTextareaScroll}
            onKeyDown={handleKeyDown}
            spellCheck={false}
            autoCapitalize="off"
            autoComplete="off"
            autoCorrect="off"
            placeholder="// Type or paste code here..."
            className="absolute inset-0 w-full h-full m-0 bg-transparent text-transparent caret-white font-mono focus:outline-none resize-none whitespace-pre selection:bg-blue-600/40 tab-4"
            style={{
              fontFamily: FONT_FAMILY,
              fontSize: `${fontSize}px`,
              lineHeight: `${lineHeight}px`,
              paddingTop: `${PADDING_TOP}px`,
              paddingBottom: `${PADDING_BOTTOM}px`,
              paddingLeft: `${PADDING_X}px`,
              paddingRight: `${PADDING_X}px`,
              tabSize: 4,
              border: 'none',
              outline: 'none',
              boxSizing: 'border-box',
              color: 'transparent',
              WebkitTextFillColor: 'transparent',
              caretColor: '#ffffff'
            }}
          />
        </div>
      </div>

      {/* Footer Info Bar */}
      <div className="flex items-center justify-between px-3 py-1 bg-[#18181b] border-t border-zinc-800 text-[11px] text-zinc-500 font-mono shrink-0">
        <div className="flex items-center gap-2.5">
          <span>{language.toUpperCase()}</span>
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
