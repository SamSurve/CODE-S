'use client';

import React, { useState } from 'react';
import {
  FileText,
  Terminal,
  Keyboard,
  GraduationCap,
  Copy,
  Check,
  RotateCcw,
  Clock,
  HardDrive,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  X,
  Loader2,
  Sparkles,
  Columns2,
  HelpCircle,
  ListOrdered
} from 'lucide-react';
import { ExecutionResponse } from '../types';
import { VIVA_DATA } from '../data/viva';

export type OutputTab = 'output' | 'pdf_sample' | 'live_run' | 'stdin' | 'viva';

/**
 * Normalizes terminal/program output for comparison:
 * 1. Convert CRLF and CR to LF
 * 2. Collapse trailing whitespace on each line
 * 3. Trim leading/trailing whitespace & extra blank lines at end
 */
export function normalizeOutput(str: string): string {
  if (!str) return '';
  return str
    .replace(/\r\n/g, '\n')
    .replace(/\r/g, '\n')
    .split('\n')
    .map((line) => line.trimEnd())
    .join('\n')
    .trim();
}

/**
 * Checks if real output matches expected practical output
 */
export function checkOutputsMatch(actual: string, expected: string): boolean {
  if (!expected || !actual) return false;
  return normalizeOutput(actual) === normalizeOutput(expected);
}

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
  practicalId?: string;
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
  practicalExpNumber,
  practicalId
}: RightOutputPanelProps) {
  const [copied, setCopied] = useState(false);
  const [showMismatchDiff, setShowMismatchDiff] = useState(true);

  // Retrieve Viva data for active practical if available
  const vivaData = practicalId ? VIVA_DATA[practicalId] : null;

  // Output matching status
  const hasExpectedOutput = Boolean(sampleOutput && sampleOutput.trim());
  const actualStdout = result?.stdout ?? '';
  const isMatched = hasExpectedOutput && Boolean(actualStdout) && checkOutputsMatch(actualStdout, sampleOutput);
  const isMismatch = hasExpectedOutput && Boolean(actualStdout) && !isMatched;

  const handleCopyCurrent = () => {
    let text = '';
    if (activeTab === 'output' || activeTab === 'pdf_sample') {
      text = sampleOutput;
    } else if (activeTab === 'stdin') {
      text = stdin;
    } else if (activeTab === 'viva') {
      if (vivaData) {
        text = [
          `PRACTICAL: ${practicalTitle || 'Practical'} (${practicalExpNumber || ''})`,
          `\nAIM:\n${vivaData.aim}`,
          `\nHOW IT WORKS:\n${vivaData.howItWorks.map((step, i) => `${i + 1}. ${step}`).join('\n')}`,
          `\nTIME COMPLEXITY:\n- Best: ${vivaData.timeComplexity.best}\n- Average: ${vivaData.timeComplexity.average}\n- Worst: ${vivaData.timeComplexity.worst}`,
          `\nSPACE COMPLEXITY:\n${vivaData.spaceComplexity}`,
          `\nVIVA QUESTIONS & ANSWERS:\n${vivaData.vivaQuestions
            .map((q, i) => `Q${i + 1}: ${q.question}\nA: ${q.answer}`)
            .join('\n\n')}`
        ].join('\n');
      }
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

  // Render Side-by-Side Diff on mismatch
  const renderMismatchDiff = () => {
    const normExpected = normalizeOutput(sampleOutput);
    const normActual = normalizeOutput(actualStdout);

    const expLines = normExpected ? normExpected.split('\n') : [];
    const actLines = normActual ? normActual.split('\n') : [];
    const maxLines = Math.max(expLines.length, actLines.length);

    const rows = [];
    for (let i = 0; i < maxLines; i++) {
      const expLine = expLines[i] ?? '';
      const actLine = actLines[i] ?? '';
      const isDiff = expLine !== actLine;
      rows.push({
        lineNum: i + 1,
        expLine,
        actLine,
        isDiff
      });
    }

    return (
      <div className="flex flex-col rounded-lg border border-zinc-800 bg-zinc-950/90 overflow-hidden font-mono text-[11px] shadow-inner">
        {/* Header bar of comparison */}
        <div className="grid grid-cols-2 bg-[#18181b] border-b border-zinc-800 px-3 py-2 text-xs font-semibold select-none">
          <div className="text-zinc-300 flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-blue-400" />
            <span>Expected</span>
          </div>
          <div className="text-zinc-300 flex items-center gap-1.5 border-l border-zinc-800 pl-3">
            <span className="w-2 h-2 rounded-full bg-rose-400" />
            <span>Your Output</span>
          </div>
        </div>

        {/* Diff lines with differing lines highlighted in red */}
        <div className="divide-y divide-zinc-900 overflow-x-auto max-h-[380px] overflow-y-auto">
          {rows.map(({ lineNum, expLine, actLine, isDiff }) => (
            <div
              key={lineNum}
              className={`grid grid-cols-2 text-xs py-1 transition-colors ${
                isDiff ? 'bg-rose-950/30' : 'hover:bg-zinc-900/30'
              }`}
            >
              {/* Left Column: Expected */}
              <div
                className={`px-3 flex gap-2 overflow-x-auto whitespace-pre font-mono ${
                  isDiff ? 'text-rose-200' : 'text-zinc-300'
                }`}
              >
                <span className="text-zinc-600 select-none text-[10px] w-6 shrink-0 text-right">{lineNum}</span>
                <span className={isDiff ? 'bg-rose-950/80 text-rose-200 px-1 rounded border border-rose-800/60' : ''}>
                  {expLine || ' '}
                </span>
              </div>

              {/* Right Column: Your Output */}
              <div
                className={`px-3 flex gap-2 border-l border-zinc-800 overflow-x-auto whitespace-pre font-mono ${
                  isDiff ? 'text-rose-300 font-semibold' : 'text-emerald-300/90'
                }`}
              >
                <span className="text-zinc-600 select-none text-[10px] w-6 shrink-0 text-right">{lineNum}</span>
                <span className={isDiff ? 'bg-rose-900/60 text-rose-200 px-1 rounded border border-rose-700/80' : ''}>
                  {actLine || ' '}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className="flex flex-col h-full w-full bg-[#121214] border border-zinc-800 rounded-xl overflow-hidden shadow-2xl min-h-0">
      {/* Top Header & Tabs Bar */}
      <div className="flex flex-wrap items-center justify-between gap-2 px-3 py-2 bg-[#18181b] border-b border-zinc-800 shrink-0">
        {/* Navigation Tabs (Output | Live Output | Input (stdin) | Viva) */}
        <div className="flex items-center gap-1 bg-zinc-950/80 p-0.5 rounded-lg border border-zinc-800/80 text-xs">
          {/* Tab 1: Output */}
          <button
            type="button"
            onClick={() => onTabChange('output')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md font-medium transition-all ${
              activeTab === 'output' || activeTab === 'pdf_sample'
                ? 'bg-blue-600 text-white shadow-sm font-semibold'
                : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/60'
            }`}
          >
            <FileText className="w-3.5 h-3.5 text-blue-300" />
            <span>Output</span>
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

          {/* Tab 4: Viva Helper Tab */}
          <button
            type="button"
            onClick={() => onTabChange('viva')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md font-medium transition-all ${
              activeTab === 'viva'
                ? 'bg-indigo-600 text-white shadow-sm font-semibold'
                : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/60'
            }`}
          >
            <GraduationCap className="w-3.5 h-3.5 text-indigo-300" />
            <span>Viva</span>
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
              type="button"
              onClick={onClearLive}
              className="p-1.5 rounded-md bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-zinc-400 hover:text-white transition-colors"
              title="Clear live output"
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </button>
          )}

          <button
            type="button"
            onClick={handleCopyCurrent}
            className="p-1.5 rounded-md bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-zinc-400 hover:text-white transition-colors"
            title="Copy current tab content"
          >
            {copied ? (
              <Check className="w-3.5 h-3.5 text-emerald-400" />
            ) : (
              <Copy className="w-3.5 h-3.5" />
            )}
          </button>
        </div>
      </div>

      {/* Main Content Area - Stretches to full available height with internal scroll */}
      <div className="relative flex-1 p-3.5 font-mono text-xs overflow-y-auto leading-relaxed select-text bg-[#0d0d10] flex flex-col min-h-0">
        {/* ========================================================================= */}
        {/* TAB 1: Output (Terminal Box Only, stretches full height)                   */}
        {/* ========================================================================= */}
        {(activeTab === 'output' || activeTab === 'pdf_sample') && (
          <pre className="flex-1 w-full p-3.5 rounded-lg bg-zinc-950/80 border border-zinc-800/80 text-emerald-300/90 whitespace-pre-wrap break-words selection:bg-emerald-500/20 leading-relaxed font-mono text-[12px] overflow-auto">
            {sampleOutput || '(No output available for this practical)'}
          </pre>
        )}

        {/* ========================================================================= */}
        {/* TAB 2: Live Execution Output with Expected vs Your Output Match Checker   */}
        {/* ========================================================================= */}
        {activeTab === 'live_run' && (
          <div className="h-full flex-1 flex flex-col min-h-0">
            {isLoading ? (
              <div className="h-full min-h-[250px] flex flex-col items-center justify-center text-zinc-500 gap-3 py-12">
                <Loader2 className="w-8 h-8 animate-spin text-emerald-500" />
                <p className="text-zinc-300 font-sans font-medium text-sm">
                  Compiling &amp; Executing in GCC Sandbox...
                </p>
                <p className="text-[11px] text-zinc-500 font-sans">
                  Using preloaded input automatically.
                </p>
              </div>
            ) : !result ? (
              <div className="h-full min-h-[250px] flex flex-col items-center justify-center text-zinc-500 gap-2.5 py-12 text-center font-sans">
                <Terminal className="w-8 h-8 text-zinc-700" />
                <p className="text-zinc-400 font-medium">No live execution yet</p>
                <p className="text-xs text-zinc-600 max-w-sm">
                  Click the blue <span className="text-blue-400 font-semibold">&quot;Run ▶&quot;</span> button on the editor to compile and execute this program.
                </p>
              </div>
            ) : (
              <div className="space-y-3 flex-1 flex flex-col min-h-0">
                {/* Match Checker Banner (Green "✓ Matched" / Red "✗ Mismatch") */}
                {hasExpectedOutput && Boolean(actualStdout) && (
                  <div className="flex items-center justify-between p-2.5 rounded-lg bg-zinc-900/90 border border-zinc-800 shrink-0 font-sans">
                    <div className="flex items-center gap-2">
                      {isMatched ? (
                        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-950 text-emerald-400 border border-emerald-700/60 shadow-sm">
                          <Check className="w-3.5 h-3.5 stroke-[2.5]" />
                          <span>Matched</span>
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-rose-950 text-rose-400 border border-rose-700/60 shadow-sm">
                          <X className="w-3.5 h-3.5 stroke-[2.5]" />
                          <span>Mismatch</span>
                        </span>
                      )}
                      <span className="text-xs text-zinc-400">
                        {isMatched
                          ? 'Program output matches the expected practical output.'
                          : 'Output differs from the expected practical output.'}
                      </span>
                    </div>

                    {/* Toggle between Side-by-Side Diff and Raw output on mismatch */}
                    {isMismatch && (
                      <button
                        type="button"
                        onClick={() => setShowMismatchDiff(!showMismatchDiff)}
                        className="flex items-center gap-1.5 px-2.5 py-1 rounded bg-zinc-800 hover:bg-zinc-750 text-xs text-zinc-300 hover:text-white border border-zinc-700 transition-colors"
                      >
                        <Columns2 className="w-3.5 h-3.5 text-zinc-400" />
                        <span>{showMismatchDiff ? 'View Raw' : 'Side-by-Side Diff'}</span>
                      </button>
                    )}
                  </div>
                )}

                {/* On Mismatch: Side-by-side view (Expected left, Your Output right, red highlight) */}
                {isMismatch && showMismatchDiff ? (
                  <div className="flex-1 flex flex-col min-h-0">
                    {renderMismatchDiff()}
                  </div>
                ) : (
                  /* Standard Output Box */
                  result.stdout && (
                    <div className="flex-1 flex flex-col min-h-0">
                      <pre className="flex-1 p-3.5 rounded-lg bg-zinc-950 border border-zinc-800 text-emerald-300 whitespace-pre-wrap break-words selection:bg-emerald-500/20 font-mono text-[12px] leading-relaxed overflow-auto">
                        {result.stdout}
                      </pre>
                    </div>
                  )
                )}

                {/* Compilation Messages / Errors */}
                {result.compile_output && (
                  <div className="space-y-1 pt-2 border-t border-zinc-800 shrink-0">
                    <span className="text-[11px] font-sans font-semibold tracking-wider text-amber-400 uppercase flex items-center gap-1.5">
                      <AlertTriangle className="w-3.5 h-3.5 text-amber-400" />
                      Compilation Output:
                    </span>
                    <pre className="p-3.5 rounded-lg bg-amber-950/20 border border-amber-800/40 text-amber-200/90 whitespace-pre-wrap break-words font-mono text-[11px] max-h-40 overflow-auto">
                      {result.compile_output}
                    </pre>
                  </div>
                )}

                {/* Stderr / Runtime Errors */}
                {result.stderr && (
                  <div className="space-y-1 pt-2 border-t border-zinc-800 shrink-0">
                    <span className="text-[11px] font-sans font-semibold tracking-wider text-rose-400 uppercase flex items-center gap-1.5">
                      <XCircle className="w-3.5 h-3.5 text-rose-400" />
                      Standard Error / Runtime Diagnostic:
                    </span>
                    <pre className="p-3.5 rounded-lg bg-rose-950/20 border border-rose-800/40 text-rose-300 whitespace-pre-wrap break-words font-mono text-[11px] max-h-40 overflow-auto">
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
        {/* TAB 3: Standard Input (stdin) (Preloaded automatically)                    */}
        {/* ========================================================================= */}
        {activeTab === 'stdin' && (
          <div className="space-y-3 font-sans h-full flex flex-col flex-1 min-h-0">
            <div className="flex items-center justify-between p-2.5 rounded-lg bg-amber-950/20 border border-amber-900/40 text-amber-300 text-xs shrink-0">
              <div className="flex items-center gap-2">
                <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                <span>
                  {sampleInput
                    ? 'Sample input automatically loaded. You may edit it freely.'
                    : 'No standard input required for this program.'}
                </span>
              </div>
              {sampleInput && stdin !== sampleInput && (
                <button
                  type="button"
                  onClick={() => onStdinChange(sampleInput)}
                  className="text-[11px] text-amber-400 hover:underline font-mono"
                >
                  Reset to Sample Input
                </button>
              )}
            </div>

            <textarea
              value={stdin}
              onChange={(e) => onStdinChange(e.target.value)}
              placeholder="Enter stdin input values here..."
              className="flex-1 w-full p-3.5 bg-zinc-950 border border-zinc-800 rounded-lg font-mono text-xs text-amber-100 placeholder:text-zinc-600 focus:outline-none focus:border-amber-500/50 resize-none min-h-[160px]"
            />

            <p className="text-[11px] text-zinc-500 shrink-0">
              When you click <span className="text-blue-400 font-semibold">&quot;Run ▶&quot;</span>, these inputs are passed directly to your program&apos;s <code className="text-zinc-400 font-mono">scanf()</code> or <code className="text-zinc-400 font-mono">cin</code> calls.
            </p>
          </div>
        )}

        {/* ========================================================================= */}
        {/* TAB 4: Viva Helper Tab (Aim, How It Works, Complexities, 4 Viva Q&As)     */}
        {/* ========================================================================= */}
        {activeTab === 'viva' && (
          <div className="space-y-4 font-sans text-xs flex-1 overflow-y-auto pr-1">
            {vivaData ? (
              <>
                {/* Aim Section */}
                <div className="p-3.5 rounded-lg bg-blue-950/20 border border-blue-900/40 space-y-1">
                  <div className="text-[11px] uppercase tracking-wider font-semibold text-blue-400">
                    Aim
                  </div>
                  <p className="text-xs text-zinc-200 leading-relaxed">{vivaData.aim}</p>
                </div>

                {/* How It Works Section */}
                <div className="p-3.5 rounded-lg bg-zinc-900/60 border border-zinc-800 space-y-2">
                  <div className="text-[11px] uppercase tracking-wider font-semibold text-zinc-400 flex items-center gap-1.5">
                    <ListOrdered className="w-3.5 h-3.5 text-zinc-400" />
                    <span>How It Works</span>
                  </div>
                  <ol className="space-y-1.5 list-decimal list-inside text-xs leading-relaxed text-zinc-300">
                    {vivaData.howItWorks.map((step, idx) => (
                      <li key={idx} className="pl-1">
                        <span>{step}</span>
                      </li>
                    ))}
                  </ol>
                </div>

                {/* Complexity Table / Grid */}
                <div className="space-y-1.5">
                  <div className="text-[11px] uppercase tracking-wider font-semibold text-emerald-400">
                    Complexity Analysis
                  </div>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                    <div className="p-2.5 rounded-lg bg-zinc-950 border border-zinc-800 text-center">
                      <div className="text-[10px] text-zinc-500 uppercase font-semibold">Best Time</div>
                      <div className="text-xs font-mono font-bold text-emerald-400 mt-0.5">
                        {vivaData.timeComplexity.best}
                      </div>
                    </div>
                    <div className="p-2.5 rounded-lg bg-zinc-950 border border-zinc-800 text-center">
                      <div className="text-[10px] text-zinc-500 uppercase font-semibold">Avg Time</div>
                      <div className="text-xs font-mono font-bold text-amber-400 mt-0.5">
                        {vivaData.timeComplexity.average}
                      </div>
                    </div>
                    <div className="p-2.5 rounded-lg bg-zinc-950 border border-zinc-800 text-center">
                      <div className="text-[10px] text-zinc-500 uppercase font-semibold">Worst Time</div>
                      <div className="text-xs font-mono font-bold text-rose-400 mt-0.5">
                        {vivaData.timeComplexity.worst}
                      </div>
                    </div>
                    <div className="p-2.5 rounded-lg bg-zinc-950 border border-zinc-800 text-center">
                      <div className="text-[10px] text-zinc-500 uppercase font-semibold">Space</div>
                      <div className="text-xs font-mono font-bold text-cyan-400 mt-0.5">
                        {vivaData.spaceComplexity}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Viva Questions & Answers */}
                <div className="space-y-2.5 pt-1">
                  <div className="text-[11px] uppercase tracking-wider font-semibold text-amber-400 flex items-center gap-1.5">
                    <HelpCircle className="w-3.5 h-3.5 text-amber-400" />
                    <span>Viva Questions &amp; Answers</span>
                  </div>

                  <div className="space-y-2">
                    {vivaData.vivaQuestions.map((qa, idx) => (
                      <div
                        key={idx}
                        className="p-3 rounded-lg bg-zinc-950 border border-zinc-800 space-y-1.5 hover:border-zinc-700 transition-colors"
                      >
                        <div className="text-xs font-semibold text-zinc-200 flex items-start gap-2">
                          <span className="text-amber-400 font-mono shrink-0">Q{idx + 1}.</span>
                          <span>{qa.question}</span>
                        </div>
                        <div className="text-xs text-zinc-300 pl-6 leading-relaxed">
                          <span className="text-emerald-400 font-semibold mr-1">Ans:</span>
                          <span>{qa.answer}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </>
            ) : (
              <div className="h-full min-h-[200px] flex flex-col items-center justify-center text-zinc-500 gap-2 text-center py-12">
                <GraduationCap className="w-8 h-8 text-zinc-700" />
                <p className="text-zinc-400 font-medium">Select a practical from the dropdown</p>
                <p className="text-xs text-zinc-600 max-w-sm">
                  Aim, algorithmic steps, time/space complexities, and viva questions will appear here automatically.
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
