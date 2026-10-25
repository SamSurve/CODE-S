'use client';

import React, { useState } from 'react';
import {
  Terminal,
  Keyboard,
  Copy,
  Check,
  RotateCcw,
  Clock,
  HardDrive,
  Loader2,
  Globe
} from 'lucide-react';

export type OutputPanelTab = 'output' | 'stdin';

interface RightOutputPanelProps {
  activeTab: OutputPanelTab;
  onTabChange: (tab: OutputPanelTab) => void;
  outputContent: string;
  isLiveResult: boolean;
  stdin: string;
  onStdinChange: (val: string) => void;
  isLoading: boolean;
  executionTime?: string | null;
  executionMemory?: number | null;
  isWebMode?: boolean;
  webSrcdoc?: string | null;
  showWebPreview?: boolean;
  onClearOutput?: () => void;
}

export default function RightOutputPanel({
  activeTab,
  onTabChange,
  outputContent,
  isLiveResult,
  stdin,
  onStdinChange,
  isLoading,
  executionTime,
  executionMemory,
  isWebMode = false,
  webSrcdoc = null,
  showWebPreview = false,
  onClearOutput
}: RightOutputPanelProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    const textToCopy = activeTab === 'output' ? outputContent : stdin;
    if (!textToCopy) return;
    navigator.clipboard.writeText(textToCopy);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <div className="flex flex-col h-full bg-[#0d0d0f] border-l border-zinc-800 text-zinc-200 select-none overflow-hidden">
      {/* Top Tab Bar: Strictly Output | Input (stdin) */}
      <div className="flex items-center justify-between px-3 h-10 border-b border-zinc-800 bg-[#141416] shrink-0">
        <div className="flex items-center gap-1.5 h-full">
          {/* Tab 1: Output */}
          <button
            onClick={() => onTabChange('output')}
            className={`flex items-center gap-2 px-3 h-full border-b-2 text-xs font-medium transition-all ${
              activeTab === 'output'
                ? 'border-blue-500 text-white bg-zinc-900/60'
                : 'border-transparent text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900/30'
            }`}
          >
            {isWebMode && showWebPreview ? (
              <Globe className="w-3.5 h-3.5 text-blue-400" />
            ) : (
              <Terminal className="w-3.5 h-3.5 text-emerald-400" />
            )}
            <span>Output</span>
            {isLiveResult && !isLoading && (
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            )}
          </button>

          {/* Tab 2: Input (stdin) */}
          <button
            onClick={() => onTabChange('stdin')}
            className={`flex items-center gap-2 px-3 h-full border-b-2 text-xs font-medium transition-all ${
              activeTab === 'stdin'
                ? 'border-blue-500 text-white bg-zinc-900/60'
                : 'border-transparent text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900/30'
            }`}
          >
            <Keyboard className="w-3.5 h-3.5 text-amber-400" />
            <span>Input (stdin)</span>
            {stdin.trim() && (
              <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
            )}
          </button>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-1.5">
          {activeTab === 'output' && onClearOutput && (
            <button
              onClick={onClearOutput}
              className="p-1 rounded text-zinc-500 hover:text-zinc-300 hover:bg-zinc-800 transition-colors"
              title="Clear output"
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </button>
          )}

          <button
            onClick={handleCopy}
            className="flex items-center gap-1 px-2 py-1 rounded text-xs text-zinc-400 hover:text-white bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 transition-colors"
            title="Copy text"
          >
            {copied ? (
              <>
                <Check className="w-3 h-3 text-emerald-400" />
                <span className="text-[11px] text-emerald-400">Copied</span>
              </>
            ) : (
              <>
                <Copy className="w-3 h-3" />
                <span className="text-[11px]">Copy</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 min-h-0 relative bg-[#09090b] flex flex-col">
        {activeTab === 'output' ? (
          <div className="flex-1 min-h-0 relative flex flex-col">
            {isLoading ? (
              <div className="flex-1 flex flex-col items-center justify-center gap-3 text-zinc-400">
                <Loader2 className="w-6 h-6 animate-spin text-blue-500" />
                <span className="text-xs font-mono">Running code in sandbox...</span>
              </div>
            ) : isWebMode && showWebPreview && webSrcdoc ? (
              /* Sandboxed Web Preview iframe */
              <div className="flex-1 min-h-0 w-full h-full bg-white relative">
                <iframe
                  title="Web Preview"
                  sandbox="allow-scripts allow-modals"
                  srcDoc={webSrcdoc}
                  className="w-full h-full border-0"
                />
              </div>
            ) : (
              /* Standard Green Terminal Style Output */
              <div className="flex-1 min-h-0 overflow-auto p-4 font-mono text-xs leading-relaxed">
                {outputContent ? (
                  <pre className="text-emerald-400 font-mono whitespace-pre-wrap select-text m-0">
                    {outputContent}
                  </pre>
                ) : (
                  <div className="h-full flex items-center justify-center text-zinc-600 text-xs italic">
                    No output yet. Click Run (Ctrl+Enter) to execute.
                  </div>
                )}
              </div>
            )}
          </div>
        ) : (
          /* Input (stdin) Tab */
          <div className="flex-1 min-h-0 flex flex-col p-3 gap-2">
            <div className="text-[11px] text-zinc-500 flex items-center justify-between">
              <span>Standard input passed to program execution</span>
              <span className="font-mono">{stdin.split('\n').filter(Boolean).length} lines</span>
            </div>
            <textarea
              value={stdin}
              onChange={(e) => onStdinChange(e.target.value)}
              placeholder="Enter standard input values here (one line per prompt)..."
              className="flex-1 w-full bg-[#121214] border border-zinc-800 rounded-lg p-3 font-mono text-xs text-zinc-200 placeholder-zinc-600 focus:outline-none focus:border-blue-500 resize-none selection:bg-blue-600/30"
              spellCheck={false}
            />
          </div>
        )}
      </div>

      {/* Footer Info Bar */}
      <div className="flex items-center justify-between px-3 py-1 bg-[#141416] border-t border-zinc-800 text-[11px] font-mono text-zinc-500 shrink-0">
        <div className="flex items-center gap-3">
          {executionTime && (
            <span className="flex items-center gap-1 text-zinc-400">
              <Clock className="w-3 h-3 text-zinc-500" />
              {executionTime}s
            </span>
          )}
          {executionMemory && (
            <span className="flex items-center gap-1 text-zinc-400">
              <HardDrive className="w-3 h-3 text-zinc-500" />
              {executionMemory} KB
            </span>
          )}
          {!executionTime && !executionMemory && (
            <span>Terminal ready</span>
          )}
        </div>
        <div className="text-zinc-500">
          {activeTab === 'output' ? 'Standard Output' : 'Standard Input'}
        </div>
      </div>
    </div>
  );
}
