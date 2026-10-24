'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import Navbar from '../components/Navbar';
import PracticalCard from '../components/PracticalCard';
import PracticalDetailModal from '../components/PracticalDetailModal';
import UploadModal from '../components/UploadModal';
import { PRACTICALS, CATEGORIES } from '../data/practicals';
import { Practical } from '../types';
import {
  Terminal,
  Search,
  BookOpen,
  ArrowRight,
  ShieldCheck,
  Cpu,
  Layers,
  Sparkles,
  Upload,
  CheckCircle2,
  Code2
} from 'lucide-react';

export default function HomePage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [activeModalPractical, setActiveModalPractical] = useState<Practical | null>(null);
  const [isUploadOpen, setIsUploadOpen] = useState(false);

  // Filtered practicals
  const filteredPracticals = useMemo(() => {
    return PRACTICALS.filter((p) => {
      const query = searchQuery.toLowerCase().trim();
      const matchesSearch =
        !query ||
        p.title.toLowerCase().includes(query) ||
        p.expNumber.toLowerCase().includes(query) ||
        p.aim.toLowerCase().includes(query) ||
        p.category.toLowerCase().includes(query) ||
        p.paradigm.toLowerCase().includes(query);

      const matchesCategory =
        selectedCategory === 'All' || p.category === selectedCategory;

      return matchesSearch && matchesCategory;
    });
  }, [searchQuery, selectedCategory]);

  return (
    <div className="min-h-screen bg-black text-zinc-100 flex flex-col font-sans selection:bg-blue-600/30">
      <Navbar />

      <main className="flex-1 flex flex-col">
        {/* Hero Section */}
        <section className="relative overflow-hidden border-b border-zinc-800/80 py-16 sm:py-24 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-zinc-950 via-zinc-950 to-black">
          {/* Subtle background glow */}
          <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] bg-blue-600/10 blur-[120px] pointer-events-none rounded-full" />
          <div className="absolute top-1/3 left-1/3 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[200px] bg-indigo-600/10 blur-[100px] pointer-events-none rounded-full" />

          <div className="relative max-w-5xl mx-auto text-center space-y-6">
            {/* Pill badge */}
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-xs font-semibold text-blue-400">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Analysis of Algorithms Practical Suite</span>
            </div>

            {/* Main Headline */}
            <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight text-white max-w-4xl mx-auto leading-[1.15]">
              AOA Practical Codes —{' '}
              <span className="bg-gradient-to-r from-blue-400 via-indigo-300 to-cyan-400 bg-clip-text text-transparent">
                Write. Run. Learn.
              </span>
            </h1>

            {/* Subtitle */}
            <p className="text-base sm:text-lg text-zinc-400 max-w-2xl mx-auto leading-relaxed">
              An open algorithm library and online C/C++ compiler for students.
              Write, upload, edit, and safely execute Analysis of Algorithms experiments
              with instant terminal output and verified test cases.
            </p>

            {/* Hero CTA Buttons */}
            <div className="flex flex-wrap items-center justify-center gap-3.5 pt-2">
              <Link
                href="/compiler"
                className="flex items-center gap-2 px-6 py-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-sm font-semibold shadow-lg shadow-blue-600/30 transition-all hover:scale-[1.02] active:scale-95"
              >
                <Terminal className="w-4 h-4" />
                <span>Launch Online Compiler</span>
                <ArrowRight className="w-4 h-4 ml-0.5" />
              </Link>

              <button
                onClick={() => setIsUploadOpen(true)}
                className="flex items-center gap-2 px-5 py-3 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-zinc-200 border border-zinc-800 text-sm font-semibold transition-all hover:border-zinc-700 active:scale-95"
              >
                <Upload className="w-4 h-4 text-blue-400" />
                <span>Upload .c / .cpp File</span>
              </button>

              <Link
                href="/practicals"
                className="flex items-center gap-2 px-5 py-3 rounded-xl bg-zinc-950 hover:bg-zinc-900 text-zinc-300 border border-zinc-800 text-sm font-semibold transition-all hover:text-white"
              >
                <BookOpen className="w-4 h-4 text-zinc-400" />
                <span>Browse 11 Practicals</span>
              </Link>
            </div>

            {/* Key Feature Stats Pills */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 pt-8 max-w-3xl mx-auto text-left">
              <div className="p-3.5 rounded-xl bg-zinc-900/40 border border-zinc-800/60 flex items-center gap-3">
                <div className="p-2 rounded-lg bg-blue-500/10 text-blue-400">
                  <BookOpen className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-sm font-bold text-white">11 Practicals</div>
                  <div className="text-[11px] text-zinc-400">Full syllabus algorithms</div>
                </div>
              </div>

              <div className="p-3.5 rounded-xl bg-zinc-900/40 border border-zinc-800/60 flex items-center gap-3">
                <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-400">
                  <Cpu className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-sm font-bold text-white">GCC 9.2+</div>
                  <div className="text-[11px] text-zinc-400">C &amp; C++ Support</div>
                </div>
              </div>

              <div className="p-3.5 rounded-xl bg-zinc-900/40 border border-zinc-800/60 flex items-center gap-3">
                <div className="p-2 rounded-lg bg-purple-500/10 text-purple-400">
                  <ShieldCheck className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-sm font-bold text-white">Judge0 Sandbox</div>
                  <div className="text-[11px] text-zinc-400">Zero server risks</div>
                </div>
              </div>

              <div className="p-3.5 rounded-xl bg-zinc-900/40 border border-zinc-800/60 flex items-center gap-3">
                <div className="p-2 rounded-lg bg-cyan-500/10 text-cyan-400">
                  <Code2 className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-sm font-bold text-white">Interactive Stdin</div>
                  <div className="text-[11px] text-zinc-400">scanf / cin ready</div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Practicals Library Section */}
        <section className="max-w-7xl w-full mx-auto p-4 sm:p-6 lg:p-8 space-y-6">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div>
              <h2 className="text-2xl font-bold text-white tracking-tight flex items-center gap-2">
                <span>AOA Practical Library</span>
                <span className="text-xs px-2.5 py-0.5 rounded-full bg-blue-500/10 text-blue-400 border border-blue-500/20 font-mono">
                  11 Experiments
                </span>
              </h2>
              <p className="text-xs sm:text-sm text-zinc-400 mt-1">
                Click any practical card to inspect the algorithm or click &quot;Run This Code&quot; to test in the compiler.
              </p>
            </div>

            <Link
              href="/practicals"
              className="text-xs text-blue-400 hover:text-blue-300 font-semibold flex items-center gap-1 self-start md:self-auto"
            >
              <span>View advanced filters &amp; categories</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {/* Quick Search & Filter Bar */}
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="w-4 h-4 absolute left-3.5 top-3 text-zinc-400 pointer-events-none" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search practicals (e.g. 'Insertion Sort', 'Dijkstra', '0/1 Knapsack', '15 Puzzle')..."
                className="w-full pl-10 pr-4 py-2 rounded-xl bg-zinc-950 border border-zinc-800 text-xs text-zinc-200 placeholder:text-zinc-500 focus:outline-none focus:border-blue-500 transition-colors"
              />
            </div>

            <div className="flex flex-wrap gap-1.5 overflow-x-auto pb-1 sm:pb-0">
              {CATEGORIES.slice(0, 6).map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-3 py-1.5 text-xs rounded-xl font-medium whitespace-nowrap transition-all ${
                    selectedCategory === cat
                      ? 'bg-blue-600 text-white'
                      : 'bg-zinc-900 text-zinc-400 hover:bg-zinc-800 hover:text-zinc-200 border border-zinc-800'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {filteredPracticals.map((practical) => (
              <PracticalCard
                key={practical.id}
                practical={practical}
                onOpenDetails={setActiveModalPractical}
              />
            ))}
          </div>

          {filteredPracticals.length === 0 && (
            <div className="p-12 text-center rounded-2xl bg-zinc-950 border border-zinc-800">
              <p className="text-zinc-400 text-sm">No practicals found matching your query.</p>
              <button
                onClick={() => {
                  setSearchQuery('');
                  setSelectedCategory('All');
                }}
                className="mt-3 text-xs text-blue-400 hover:underline"
              >
                Clear search query
              </button>
            </div>
          )}
        </section>

        {/* Workflow Showcase */}
        <section className="border-t border-zinc-800/80 bg-zinc-950/60 py-16 px-4 sm:px-6 lg:px-8 mt-12">
          <div className="max-w-5xl mx-auto">
            <div className="text-center space-y-2 mb-12">
              <span className="text-xs uppercase tracking-wider text-blue-400 font-semibold">
                Designed for Engineering Students
              </span>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-white">
                How It Works — Simple &amp; Powerful
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="p-6 rounded-2xl bg-zinc-900/60 border border-zinc-800 space-y-3">
                <div className="w-8 h-8 rounded-lg bg-blue-500/10 text-blue-400 font-mono font-bold flex items-center justify-center">
                  1
                </div>
                <h3 className="text-base font-bold text-zinc-100">Pick or Upload</h3>
                <p className="text-xs text-zinc-400 leading-relaxed">
                  Choose from 11 verified college AOA algorithms or drag-and-drop your custom{' '}
                  <code className="text-zinc-300 font-mono">.c</code> or{' '}
                  <code className="text-zinc-300 font-mono">.cpp</code> files.
                </p>
              </div>

              <div className="p-6 rounded-2xl bg-zinc-900/60 border border-zinc-800 space-y-3">
                <div className="w-8 h-8 rounded-lg bg-indigo-500/10 text-indigo-400 font-mono font-bold flex items-center justify-center">
                  2
                </div>
                <h3 className="text-base font-bold text-zinc-100">Edit &amp; Provide Stdin</h3>
                <p className="text-xs text-zinc-400 leading-relaxed">
                  Write or modify code inside the VS Code-grade Monaco editor. Easily supply custom test inputs for{' '}
                  <code className="text-zinc-300 font-mono">scanf()</code> and{' '}
                  <code className="text-zinc-300 font-mono">cin</code>.
                </p>
              </div>

              <div className="p-6 rounded-2xl bg-zinc-900/60 border border-zinc-800 space-y-3">
                <div className="w-8 h-8 rounded-lg bg-emerald-500/10 text-emerald-400 font-mono font-bold flex items-center justify-center">
                  3
                </div>
                <h3 className="text-base font-bold text-zinc-100">Run &amp; Analyze</h3>
                <p className="text-xs text-zinc-400 leading-relaxed">
                  Execute code through isolated Judge0 sandboxes. Inspect execution output, compilation messages, execution time, and memory consumption in milliseconds.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="border-t border-zinc-800 bg-black py-8 px-4 sm:px-6 lg:px-8 text-xs text-zinc-500">
          <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-lg bg-blue-600/20 text-blue-400 flex items-center justify-center font-bold text-xs">
                AOA
              </div>
              <span className="font-semibold text-zinc-300">
                AOA Practical Codes — Write. Run. Learn.
              </span>
            </div>

            <div className="flex items-center gap-4 text-zinc-400">
              <span>Source manual: Siddhant Surve, 101, B-5</span>
              <span>·</span>
              <span className="text-emerald-400 flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" />
                Vercel Ready
              </span>
            </div>
          </div>
        </footer>
      </main>

      {/* Practical Details Modal */}
      <PracticalDetailModal
        practical={activeModalPractical}
        isOpen={Boolean(activeModalPractical)}
        onClose={() => setActiveModalPractical(null)}
      />

      {/* Upload Modal */}
      <UploadModal isOpen={isUploadOpen} onClose={() => setIsUploadOpen(false)} />
    </div>
  );
}
