'use client';

import React, { useState } from 'react';
import {
  Terminal,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Clock,
  HardDrive,
  Copy,
  Check,
  RotateCcw,
  Loader2,
  Cpu
} from 'lucide-react';
import { ExecutionResponse } from '../types';

interface TerminalOutputProps {
  result: ExecutionResponse | null;
  isLoading: boolean;
  onClear: () => void;
}

export default function TerminalOutput({
  result,
  isLoading,
  onClear
}: TerminalOutputProps) {
  const [copied, setCopied] = useState(false);

  const getStatusBadge = () => {
    if (!result) return null;
    const statusId = result.status?.id;
    const desc = result.status?.description || 'Unknown Status';

    if (statusId === 3) {
      return (
        <span className="flex items-center gap-1.5 px-2.5 py-1 text-xs font-semibold rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
          <CheckCircle2 className="w-3.5 h-3.5" />
          <span>{desc}</span>
        </span>
      );
    }

    if (statusId === 6) {
      return (
        <span className="flex items-center gap-1.5 px-2.5 py-1 text-xs font-semibold rounded-lg bg-amber-500/10 text-amber-400 border border-amber-500/20">
          <AlertTriangle className="w-3.5 h-3.5" />
          <span>Compilation Error</span>
        </span>
      );
    }

    if (statusId === 5) {
      return (
        <span className="flex items-center gap-1.5 px-2.5 py-1 text-xs font-semibold rounded-lg bg-orange-500/10 text-orange-400 border border-orange-500/20">
          <Clock className="w-3.5 h-3.5" />
          <span>Time Limit Exceeded</span>
        </span>
      );
    }

    return (
      <span className="flex items-center gap-1.5 px-2.5 py-1 text-xs font-semibold rounded-lg bg-rose-500/10 text-rose-400 border border-rose-500/20">
        <XCircle className="w-3.5 h-3.5" />
        <span>{desc}</span>
      </span>
    );
  };

  const handleCopy = () => {
    const textToCopy = [
      result?.stdout || '',
      result?.compile_output ? `--- Compilation Output ---\n${result.compile_output}` : '',
      result?.stderr ? `--- Standard Error ---\n${result.stderr}` : ''
    ]
      .filter(Boolean)
      .join('\n\n');

    if (!textToCopy) return;
    navigator.clipboard.writeText(textToCopy);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="flex flex-col h-full bg-zinc-950 rounded-2xl border border-zinc-800 overflow-hidden shadow-xl">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-2 px-4 py-2.5 bg-zinc-900 border-b border-zinc-800">
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-red-500/80 inline-block" />
            <span className="w-2.5 h-2.5 rounded-full bg-amber-500/80 inline-block" />
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500/80 inline-block" />
          </div>
          <div className="flex items-center gap-1.5 font-semibold text-xs text-zinc-300 ml-2">
            <Terminal className="w-4 h-4 text-emerald-400" />
            <span>Terminal Execution Output</span>
          </div>
        </div>

        {/* Metrics & Status */}
        <div className="flex items-center gap-2">
          {isLoading && (
            <div className="flex items-center gap-2 px-2.5 py-1 rounded-lg bg-blue-500/10 text-blue-400 border border-blue-500/20 text-xs">
              <Loader2 className="w-3.5 h-3.5 animate-spin" />
              <span>Compiling & Executing in Sandbox...</span>
            </div>
          )}

          {!isLoading && result && (
            <div className="flex items-center gap-2">
              {getStatusBadge()}

              {result.time && (
                <div className="hidden sm:flex items-center gap-1 px-2 py-0.5 rounded-md bg-zinc-800 text-[11px] font-mono text-zinc-400">
                  <Clock className="w-3 h-3 text-zinc-500" />
                  <span>{result.time}s</span>
                </div>
              )}

              {result.memory && (
                <div className="hidden sm:flex items-center gap-1 px-2 py-0.5 rounded-md bg-zinc-800 text-[11px] font-mono text-zinc-400">
                  <HardDrive className="w-3 h-3 text-zinc-500" />
                  <span>{result.memory} KB</span>
                </div>
              )}
            </div>
          )}

          {result && !isLoading && (
            <>
              <button
                onClick={handleCopy}
                className="p-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-400 hover:text-white transition-colors"
                title="Copy output"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              </button>
              <button
                onClick={onClear}
                className="p-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-400 hover:text-white transition-colors"
                title="Clear console"
              >
                <RotateCcw className="w-3.5 h-3.5" />
              </button>
            </>
          )}
        </div>
      </div>

      {/* Output Content */}
      <div className="relative flex-1 p-4 font-mono text-xs overflow-y-auto leading-relaxed select-text min-h-[220px]">
        {isLoading ? (
          <div className="h-full flex flex-col items-center justify-center text-zinc-500 gap-3 py-12">
            <Loader2 className="w-8 h-8 animate-spin text-emerald-500" />
            <p className="text-zinc-400 font-medium">Executing program in secure sandboxed container...</p>
            <p className="text-[11px] text-zinc-600">GCC Compiler is building binary and generating stdout</p>
          </div>
        ) : !result ? (
          <div className="h-full flex flex-col items-center justify-center text-zinc-600 gap-2.5 py-12 text-center">
            <Cpu className="w-8 h-8 text-zinc-700" />
            <p className="text-zinc-400 font-medium">Ready for execution</p>
            <p className="text-[11px] text-zinc-600 max-w-sm">
              Press <kbd className="px-1.5 py-0.5 rounded bg-zinc-800 text-zinc-300 font-mono">Run Code</kbd> or press{' '}
              <kbd className="px-1.5 py-0.5 rounded bg-zinc-800 text-zinc-300 font-mono">Ctrl + Enter</kbd> to compile and execute your C/C++ program.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {/* Standard Output */}
            {result.stdout ? (
              <div className="space-y-1">
                <span className="text-[10px] font-semibold tracking-wider text-emerald-400/70 uppercase">
                  Output:
                </span>
                <pre className="text-emerald-300 whitespace-pre-wrap break-words selection:bg-emerald-500/20">
                  {result.stdout}
                </pre>
              </div>
            ) : null}

            {/* Compilation Output (GCC Errors / Warnings) */}
            {result.compile_output ? (
              <div className="space-y-1 pt-2 border-t border-zinc-800/80">
                <span className="text-[10px] font-semibold tracking-wider text-amber-400 uppercase flex items-center gap-1.5">
                  <AlertTriangle className="w-3 h-3 text-amber-400" />
                  Compilation Messages / Warnings:
                </span>
                <pre className="text-amber-200/90 whitespace-pre-wrap break-words bg-amber-950/20 p-3 rounded-xl border border-amber-800/40">
                  {result.compile_output}
                </pre>
              </div>
            ) : null}

            {/* Standard Error / Runtime Error */}
            {result.stderr ? (
              <div className="space-y-1 pt-2 border-t border-zinc-800/80">
                <span className="text-[10px] font-semibold tracking-wider text-rose-400 uppercase flex items-center gap-1.5">
                  <XCircle className="w-3 h-3 text-rose-400" />
                  Standard Error / Runtime Message:
                </span>
                <pre className="text-rose-300 whitespace-pre-wrap break-words bg-rose-950/20 p-3 rounded-xl border border-rose-800/40">
                  {result.stderr}
                </pre>
              </div>
            ) : null}

            {/* Fallback when Accepted but no stdout */}
            {!result.stdout && !result.compile_output && !result.stderr && (
              <div className="text-zinc-500 italic">
                Program completed with status &quot;{result.status.description}&quot; and produced no output.
              </div>
            )}
          </div>
        )}
      </div>

      {/* Footer Info */}
      <div className="flex items-center justify-between px-4 py-1.5 bg-zinc-900 border-t border-zinc-800 text-[11px] text-zinc-500 font-mono">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-emerald-400 inline-block animate-pulse" />
          <span>{result?.engine || 'Sandboxed Execution Engine'}</span>
        </div>
        <div>
          {result && (
            <span>
              Process exited with code {result.status.id === 3 ? '0' : result.status.id}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
