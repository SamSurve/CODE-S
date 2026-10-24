'use client';

import React from 'react';
import { TerminalSquare, RotateCcw, Sparkles } from 'lucide-react';

interface StdinPanelProps {
  stdin: string;
  onChange: (val: string) => void;
  sampleInput?: string;
  onLoadSample?: () => void;
}

export default function StdinPanel({
  stdin,
  onChange,
  sampleInput,
  onLoadSample
}: StdinPanelProps) {
  return (
    <div className="flex flex-col bg-zinc-950 rounded-2xl border border-zinc-800 overflow-hidden shadow-lg">
      <div className="flex items-center justify-between px-4 py-2.5 bg-zinc-900 border-b border-zinc-800 text-xs">
        <div className="flex items-center gap-2 font-semibold text-zinc-300">
          <TerminalSquare className="w-4 h-4 text-amber-400" />
          <span>Standard Input (stdin)</span>
        </div>

        <div className="flex items-center gap-2">
          {sampleInput && onLoadSample && (
            <button
              onClick={onLoadSample}
              className="flex items-center gap-1 px-2.5 py-1 text-[11px] font-medium rounded-lg bg-amber-500/10 text-amber-300 border border-amber-500/20 hover:bg-amber-500/20 transition-all"
              title="Autofill sample input for current practical"
            >
              <Sparkles className="w-3 h-3 text-amber-400" />
              <span>Use Sample Input</span>
            </button>
          )}

          {stdin && (
            <button
              onClick={() => onChange('')}
              className="flex items-center gap-1 px-2 py-1 text-[11px] text-zinc-500 hover:text-zinc-300 transition-colors"
            >
              <RotateCcw className="w-3 h-3" />
              <span>Clear</span>
            </button>
          )}
        </div>
      </div>

      <div className="p-3">
        <textarea
          value={stdin}
          onChange={(e) => onChange(e.target.value)}
          placeholder={`Enter program inputs expected by scanf() or cin here...
Example:
5
55 83 75 23 22`}
          className="w-full h-24 sm:h-28 bg-zinc-900/60 border border-zinc-800/80 rounded-xl p-3 text-xs font-mono text-amber-100 placeholder:text-zinc-600 focus:outline-none focus:border-amber-500/50 resize-y"
        />
        <p className="text-[11px] text-zinc-500 mt-1.5">
          Enter arguments separated by spaces or newlines exactly as prompted by your C/C++ program.
        </p>
      </div>
    </div>
  );
}
