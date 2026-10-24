'use client';

import React from 'react';
import {
  FileText,
  Terminal,
  Keyboard,
  Copy,
  Check,
  RotateCcw,
  Clock,
  HardDrive,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  Loader2,
  Sparkles
} from 'lucide-react';
import { ExecutionResponse } from '../types';

export type OutputTab = 'pdf_sample' | 'live_run' | 'stdin';

interface RightOutputPanelProps {
  activeTab: OutputTab;
  onTabChange: (tab: OutputTab) => void;
  sampleOutput: string;
  sampleInput: string;
  stdin: string;
  onStdinChange: (val: string) => void;
  result: ExecutionResponse | null;
  isLoading: boolean;
  onClearLive: () => void;
  practicalTitle?: string;
  practicalExpNumber?: string;
}

export default function RightOutputPanel({
  activeTab,
  onTabChange,
  sampleOutput,
  sampleInput,
  stdin,
  onStdinChange,
  result,
  isLoading,
  onClearLive,
  practicalTitle,
  practicalExpNumber
}: RightOutputPanelProps) {
  const [copied, setCopied] = React.useState(false);

  const handleCopyCurrent = () => {
    let text = '';
    if (activeTab === 'pdf_sample') {
      text = sampleOutput;
    } else if (activeTab === 'stdin') {
      text = stdin;
    } else {
      text = [
        result?.stdout || '',
        result?.compile_output ? `--- Compilation Output ---\n${result.compile_output}` : '',
        result?.stderr ? `--- Standard Error ---\n${result.stderr}` : ''
      ]
        .filter(Boolean)
        .join('\n\n');
    }

    if (!text) return;
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const getStatusBadge = () => {
    if (!result) return null;
    const statusId = result.status?.id;
    const desc = result.status?.description || 'Completed';

    if (statusId === 3) {
      return (
        <span className="flex items-center gap-1.5 px-2 py-0.5 text-[11px] font-semibold rounded-md bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-mono">
          <CheckCircle2 className="w-3 h-3" />
          <span>{desc}</span>
        </span>
      );
    }

    if (statusId === 6) {
      return (
        <span className="flex items-center gap-1.5 px-2 py-0.5 text-[11px] font-semibold rounded-md bg-amber-500/10 text-amber-400 border border-amber-500/20 font-mono">
          <AlertTriangle className="w-3 h-3" />
          <span>Compilation Error</span>
        </span>
      );
    }

    if (statusId === 5) {
      return (
        <span className="flex items-center gap-1.5 px-2 py-0.5 text-[11px] font-semibold rounded-md bg-orange-500/10 text-orange-400 border border-orange-500/20 font-mono">
          <Clock className="w-3 h-3" />
          <span>Time Limit Exceeded</span>
        </span>
      );
    }

    return (
      <span className="flex items-center gap-1.5 px-2 py-0.5 text-[11px] font-semibold rounded-md bg-rose-500/10 text-rose-400 border border-rose-500/20 font-mono">
        <XCircle className="w-3 h-3" />
        <span>{desc}</span>
      </span>
    );
  };

  return (
    <div className="flex flex-col h-full bg-[#121214] border border-zinc-800 rounded-xl overflow-hidden shadow-2xl">
      {/* Top Header & Tabs Bar */}
      <div className="flex flex-wrap items-center justify-between gap-2 px-3 py-2 bg-[#18181b] border-b border-zinc-800 shrink-0">
        {/* Navigation Tabs */}
        <div className="flex items-center gap-1 bg-zinc-950/80 p-0.5 rounded-lg border border-zinc-800/80 text-xs">
          {/* Tab 1: Sample Output from PDF (Default when practical is selected) */}
          <button
            type="button"
            onClick={() => onTabChange('pdf_sample')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md font-medium transition-all ${
              activeTab === 'pdf_sample'
                ? 'bg-blue-600 text-white shadow-sm font-semibold'
                : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/60'
            }`}
          >
            <FileText className="w-3.5 h-3.5 text-blue-300" />
            <span>Sample Output from PDF</span>
          </button>

          {/* Tab 2: Live Execution Output */}
          <button
            type="button"
            onClick={() => onTabChange('live_run')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md font-medium transition-all ${
              activeTab === 'live_run'
                ? 'bg-zinc-800 text-emerald-400 shadow-sm font-semibold border border-zinc-700/60'
                : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/60'
            }`}
          >
            <Terminal className="w-3.5 h-3.5 text-emerald-400" />
            <span>Live Output</span>
            {result && !isLoading && (
              <span className="w-2 h-2 rounded-full bg-emerald-400 inline-block animate-pulse ml-0.5" />
            )}
          </button>

          {/* Tab 3: Standard Input (stdin) */}
          <button
            type="button"
            onClick={() => onTabChange('stdin')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md font-medium transition-all ${
              activeTab === 'stdin'
                ? 'bg-zinc-800 text-amber-300 shadow-sm font-semibold border border-zinc-700/60'
                : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/60'
            }`}
          >
            <Keyboard className="w-3.5 h-3.5 text-amber-400" />
            <span>Input (stdin)</span>
          </button>
        </div>

        {/* Right Action Icons (Copy, Clear, Metrics) */}
        <div className="flex items-center gap-2">
          {activeTab === 'live_run' && !isLoading && result && (
            <div className="flex items-center gap-2">
              {getStatusBadge()}

              {result.time && (
                <div className="hidden sm:flex items-center gap-1 px-2 py-0.5 rounded bg-zinc-900 border border-zinc-800 text-[10px] font-mono text-zinc-400">
                  <Clock className="w-3 h-3 text-zinc-500" />
                  <span>{result.time}s</span>
                </div>
              )}

              {result.memory && (
                <div className="hidden sm:flex items-center gap-1 px-2 py-0.5 rounded bg-zinc-900 border border-zinc-800 text-[10px] font-mono text-zinc-400">
                  <HardDrive className="w-3 h-3 text-zinc-500" />
                  <span>{result.memory} KB</span>
                </div>
              )}
            </div>
          )}

          {activeTab === 'live_run' && result && !isLoading && (
            <button
              onClick={onClearLive}
              className="p-1.5 rounded-md bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-zinc-400 hover:text-white transition-colors"
              title="Clear live output"
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </button>
          )}

          <button
            onClick={handleCopyCurrent}
            className="p-1.5 rounded-md bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-zinc-400 hover:text-white transition-colors"
            title="Copy current panel content"
          >
            {copied ? (
              <Check className="w-3.5 h-3.5 text-emerald-400" />
            ) : (
              <Copy className="w-3.5 h-3.5" />
            )}
          </button>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="relative flex-1 p-4 font-mono text-xs overflow-y-auto leading-relaxed select-text bg-[#0d0d10]">
        {/* ========================================================================= */}
        {/* TAB 1: Sample Output from PDF (Immediately shown on practical selection) */}
        {/* ========================================================================= */}
        {activeTab === 'pdf_sample' && (
          <div className="space-y-3">
            {/* Context Banner */}
            <div className="flex items-center justify-between p-2.5 rounded-lg bg-blue-950/20 border border-blue-900/40 text-blue-300 text-[11px] font-sans">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-blue-400 inline-block" />
                <span className="font-semibold text-blue-200">
                  Sample Output from PDF — {practicalExpNumber ? `${practicalExpNumber}: ` : ''}{practicalTitle || 'Practical'}
                </span>
              </div>
              <span className="text-[10px] text-blue-400/80 font-mono">
                Verified lab record
              </span>
            </div>

            {/* Preserved PDF Output */}
            <pre className="p-3.5 rounded-lg bg-zinc-950/80 border border-zinc-800/80 text-emerald-300/90 whitespace-pre-wrap break-words selection:bg-emerald-500/20 leading-relaxed font-mono text-[12px]">
              {sampleOutput || '(No sample output available for this practical)'}
            </pre>

            <div className="flex items-center justify-between text-[11px] text-zinc-500 font-sans pt-1">
              <span>This output is extracted directly from the student PDF lab manual.</span>
              <span className="font-mono text-blue-400/80">Press &quot;Run ▶&quot; to test live</span>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* TAB 2: Live Execution Output (Executed via Judge0 API when user clicks Run) */}
        {/* ========================================================================= */}
        {activeTab === 'live_run' && (
          <div className="h-full">
            {isLoading ? (
              <div className="h-full min-h-[300px] flex flex-col items-center justify-center text-zinc-500 gap-3 py-12">
                <Loader2 className="w-8 h-8 animate-spin text-emerald-500" />
                <p className="text-zinc-300 font-sans font-medium text-sm">
                  Compiling &amp; Executing in GCC Sandbox...
                </p>
                <p className="text-[11px] text-zinc-500 font-sans">
                  Using preloaded PDF sample input automatically.
                </p>
              </div>
            ) : !result ? (
              <div className="h-full min-h-[300px] flex flex-col items-center justify-center text-zinc-500 gap-2.5 py-12 text-center font-sans">
                <Terminal className="w-8 h-8 text-zinc-700" />
                <p className="text-zinc-400 font-medium">No live execution yet</p>
                <p className="text-xs text-zinc-600 max-w-sm">
                  Click the blue <span className="text-blue-400 font-semibold">&quot;Run ▶&quot;</span> button on the editor to compile and execute this program in the live sandbox.
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {/* Standard Output */}
                {result.stdout && (
                  <div className="space-y-1">
                    <div className="flex items-center justify-between text-[11px] font-sans text-emerald-400 font-semibold tracking-wider uppercase">
                      <span>Live Program Stdout:</span>
                      <span className="text-zinc-500 font-mono text-[10px]">
                        Exit Code: {result.status.id === 3 ? '0 (Success)' : result.status.id}
                      </span>
                    </div>
                    <pre className="p-3.5 rounded-lg bg-zinc-950 border border-zinc-800 text-emerald-300 whitespace-pre-wrap break-words selection:bg-emerald-500/20 font-mono text-[12px] leading-relaxed">
                      {result.stdout}
                    </pre>
                  </div>
                )}

                {/* Compilation Messages / Errors */}
                {result.compile_output && (
                  <div className="space-y-1 pt-2 border-t border-zinc-800/80">
                    <span className="text-[11px] font-sans font-semibold tracking-wider text-amber-400 uppercase flex items-center gap-1.5">
                      <AlertTriangle className="w-3.5 h-3.5 text-amber-400" />
                      Compilation Output:
                    </span>
                    <pre className="p-3.5 rounded-lg bg-amber-950/20 border border-amber-800/40 text-amber-200/90 whitespace-pre-wrap break-words font-mono text-[11px]">
                      {result.compile_output}
                    </pre>
                  </div>
                )}

                {/* Stderr / Runtime Errors */}
                {result.stderr && (
                  <div className="space-y-1 pt-2 border-t border-zinc-800/80">
                    <span className="text-[11px] font-sans font-semibold tracking-wider text-rose-400 uppercase flex items-center gap-1.5">
                      <XCircle className="w-3.5 h-3.5 text-rose-400" />
                      Standard Error / Runtime Diagnostic:
                    </span>
                    <pre className="p-3.5 rounded-lg bg-rose-950/20 border border-rose-800/40 text-rose-300 whitespace-pre-wrap break-words font-mono text-[11px]">
                      {result.stderr}
                    </pre>
                  </div>
                )}

                {!result.stdout && !result.compile_output && !result.stderr && (
                  <div className="text-zinc-500 italic p-4 text-center font-sans text-xs">
                    Process completed with status &quot;{result.status.description}&quot; and generated no output.
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* ========================================================================= */}
        {/* TAB 3: Standard Input (stdin) (Preloaded automatically from PDF)          */}
        {/* ========================================================================= */}
        {activeTab === 'stdin' && (
          <div className="space-y-3 font-sans">
            <div className="flex items-center justify-between p-2.5 rounded-lg bg-amber-950/20 border border-amber-900/40 text-amber-300 text-xs">
              <div className="flex items-center gap-2">
                <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                <span>
                  {sampleInput
                    ? 'Sample input automatically loaded from PDF. You may edit it freely.'
                    : 'No standard input required for this program.'}
                </span>
              </div>
              {sampleInput && stdin !== sampleInput && (
                <button
                  type="button"
                  onClick={() => onStdinChange(sampleInput)}
                  className="text-[11px] text-amber-400 hover:underline font-mono"
                >
                  Reset to PDF Sample
                </button>
              )}
            </div>

            <textarea
              value={stdin}
              onChange={(e) => onStdinChange(e.target.value)}
              placeholder="Enter stdin input values here..."
              className="w-full h-64 p-3 bg-zinc-950 border border-zinc-800 rounded-lg font-mono text-xs text-amber-100 placeholder:text-zinc-600 focus:outline-none focus:border-amber-500/50 resize-y"
            />

            <p className="text-[11px] text-zinc-500">
              When you click <span className="text-blue-400 font-semibold">&quot;Run ▶&quot;</span>, these inputs are passed directly to your program&apos;s <code className="text-zinc-400 font-mono">scanf()</code> or <code className="text-zinc-400 font-mono">cin</code> calls.
            </p>
          </div>
        )}
      </div>

      {/* Footer Info Bar */}
      <div className="flex items-center justify-between px-3 py-1.5 bg-[#18181b] border-t border-zinc-800 text-[11px] text-zinc-500 font-mono shrink-0">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-emerald-400 inline-block" />
          <span>{result?.engine || 'Judge0 CE Sandboxed Engine'}</span>
        </div>
        <div className="flex items-center gap-3">
          <span>Active: {activeTab === 'pdf_sample' ? 'Sample Output (PDF)' : activeTab === 'live_run' ? 'Live Execution' : 'Standard Input'}</span>
        </div>
      </div>
    </div>
  );
}
