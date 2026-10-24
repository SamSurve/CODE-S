'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Practical } from '../types';
import {
  X,
  Play,
  Copy,
  Check,
  Clock,
  Layers,
  Terminal,
  FileCode2,
  ListOrdered,
  Sparkles,
  ExternalLink
} from 'lucide-react';

interface PracticalDetailModalProps {
  practical: Practical | null;
  isOpen: boolean;
  onClose: () => void;
}

export default function PracticalDetailModal({
  practical,
  isOpen,
  onClose
}: PracticalDetailModalProps) {
  const router = useRouter();
  const [copiedCode, setCopiedCode] = useState(false);
  const [copiedInput, setCopiedInput] = useState(false);
  const [copiedOutput, setCopiedOutput] = useState(false);

  if (!isOpen || !practical) return null;

  const handleCopyCode = () => {
    navigator.clipboard.writeText(practical.sourceCode);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  const handleCopyInput = () => {
    navigator.clipboard.writeText(practical.sampleInput);
    setCopiedInput(true);
    setTimeout(() => setCopiedInput(false), 2000);
  };

  const handleCopyOutput = () => {
    navigator.clipboard.writeText(practical.sampleOutput);
    setCopiedOutput(true);
    setTimeout(() => setCopiedOutput(false), 2000);
  };

  const handleRunCode = () => {
    onClose();
    router.push(`/compiler?practical=${practical.id}`);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-4xl bg-zinc-900 border border-zinc-800 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-zinc-800 bg-zinc-950/70">
          <div className="flex items-center gap-3">
            <span className="px-2.5 py-1 text-xs font-mono font-bold tracking-wider rounded-lg bg-blue-500/10 text-blue-400 border border-blue-500/20">
              {practical.expNumber}
            </span>
            <div>
              <h2 className="text-lg font-bold text-zinc-100 flex items-center gap-2">
                {practical.title}
              </h2>
              <p className="text-xs text-zinc-400">
                Category: <span className="text-zinc-200">{practical.category}</span> · Paradigm:{' '}
                <span className="text-zinc-200">{practical.paradigm}</span>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleRunCode}
              className="flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold rounded-xl bg-blue-600 hover:bg-blue-500 text-white shadow-lg shadow-blue-600/30 transition-all active:scale-95"
            >
              <Play className="w-3.5 h-3.5 fill-current" />
              <span>Run in Compiler</span>
            </button>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Scrollable Content */}
        <div className="p-6 overflow-y-auto space-y-6 text-sm text-zinc-300">
          {/* Aim Card */}
          <div className="p-4 rounded-xl bg-zinc-950/60 border border-zinc-800/80">
            <div className="flex items-center gap-2 text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-1.5">
              <Sparkles className="w-3.5 h-3.5 text-blue-400" />
              <span>Aim of Experiment</span>
            </div>
            <p className="text-zinc-100 text-sm leading-relaxed">{practical.aim}</p>
          </div>

          {/* Complexity Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div className="p-3.5 rounded-xl bg-zinc-950/40 border border-zinc-800/60">
              <div className="flex items-center gap-2 text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-2">
                <Clock className="w-3.5 h-3.5 text-amber-400" />
                <span>Time Complexity</span>
              </div>
              <ul className="space-y-1 text-xs">
                <li>
                  <span className="text-zinc-400">Best Case:</span>{' '}
                  <code className="text-emerald-400 font-mono font-medium">{practical.timeComplexity.best}</code>
                </li>
                <li>
                  <span className="text-zinc-400">Average Case:</span>{' '}
                  <code className="text-blue-400 font-mono font-medium">{practical.timeComplexity.average}</code>
                </li>
                <li>
                  <span className="text-zinc-400">Worst Case:</span>{' '}
                  <code className="text-amber-400 font-mono font-medium">{practical.timeComplexity.worst}</code>
                </li>
              </ul>
            </div>

            <div className="p-3.5 rounded-xl bg-zinc-950/40 border border-zinc-800/60">
              <div className="flex items-center gap-2 text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-2">
                <Layers className="w-3.5 h-3.5 text-cyan-400" />
                <span>Space Complexity & Author</span>
              </div>
              <div className="space-y-1.5 text-xs">
                <div>
                  <span className="text-zinc-400">Space:</span>{' '}
                  <code className="text-cyan-400 font-mono font-medium">{practical.spaceComplexity}</code>
                </div>
                <div>
                  <span className="text-zinc-400">Author:</span>{' '}
                  <span className="text-zinc-200 font-medium">{practical.author}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Algorithm Steps */}
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-2.5">
              <ListOrdered className="w-3.5 h-3.5 text-indigo-400" />
              <span>Step-by-Step Algorithm</span>
            </div>
            <ol className="space-y-2 list-none p-4 rounded-xl bg-zinc-950/60 border border-zinc-800/80 text-xs text-zinc-300 leading-relaxed font-sans">
              {practical.algorithm.map((step, idx) => (
                <li key={idx} className="flex gap-3 items-start">
                  <span className="w-5 h-5 rounded-md bg-zinc-800 text-blue-400 font-mono font-bold flex items-center justify-center shrink-0 text-[11px]">
                    {idx + 1}
                  </span>
                  <span className="mt-0.5">{step}</span>
                </li>
              ))}
            </ol>
          </div>

          {/* Source Code Section */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2 text-xs font-semibold text-zinc-400 uppercase tracking-wider">
                <FileCode2 className="w-3.5 h-3.5 text-blue-400" />
                <span>Source Code ({practical.language.toUpperCase()})</span>
              </div>
              <button
                onClick={handleCopyCode}
                className="flex items-center gap-1 px-2.5 py-1 text-xs rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-300 transition-colors"
              >
                {copiedCode ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-400" />
                    <span className="text-emerald-400">Copied!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    <span>Copy Code</span>
                  </>
                )}
              </button>
            </div>
            <div className="relative rounded-xl border border-zinc-800 bg-zinc-950 p-4 font-mono text-xs text-zinc-200 overflow-x-auto max-h-72 leading-relaxed selection:bg-blue-600/30">
              <pre>{practical.sourceCode}</pre>
            </div>
          </div>

          {/* Sample Input & Output */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Input */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">
                  Sample Standard Input
                </span>
                {practical.sampleInput && (
                  <button
                    onClick={handleCopyInput}
                    className="flex items-center gap-1 text-[11px] text-zinc-500 hover:text-zinc-300"
                  >
                    {copiedInput ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                    <span>{copiedInput ? 'Copied' : 'Copy'}</span>
                  </button>
                )}
              </div>
              <div className="rounded-xl border border-zinc-800 bg-zinc-950 p-3 font-mono text-xs text-amber-200/90 min-h-[90px] overflow-auto">
                <pre>{practical.sampleInput || '(No stdin input required)'}</pre>
              </div>
            </div>

            {/* Output */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">
                  Sample Console Output
                </span>
                <button
                  onClick={handleCopyOutput}
                  className="flex items-center gap-1 text-[11px] text-zinc-500 hover:text-zinc-300"
                >
                  {copiedOutput ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                  <span>{copiedOutput ? 'Copied' : 'Copy'}</span>
                </button>
              </div>
              <div className="rounded-xl border border-zinc-800 bg-zinc-950 p-3 font-mono text-xs text-emerald-300/90 min-h-[90px] overflow-auto">
                <pre>{practical.sampleOutput}</pre>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between px-6 py-4 border-t border-zinc-800 bg-zinc-950/70">
          <span className="text-xs text-zinc-500 hidden sm:inline">
            Preserved directly from college syllabus AOA record
          </span>
          <div className="flex items-center gap-3 w-full sm:w-auto justify-end">
            <button
              onClick={onClose}
              className="px-4 py-2 text-xs font-medium text-zinc-400 hover:text-zinc-200 transition-colors"
            >
              Close
            </button>
            <button
              onClick={handleRunCode}
              className="flex items-center gap-2 px-5 py-2 text-xs font-semibold rounded-xl bg-blue-600 hover:bg-blue-500 text-white shadow-lg shadow-blue-600/30 transition-all active:scale-95"
            >
              <Play className="w-3.5 h-3.5 fill-current" />
              <span>Open & Run in Compiler</span>
              <ExternalLink className="w-3.5 h-3.5 ml-1" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
